package org.ppnovel.web.service.pay;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.constant.ConsumeBizType;
import org.ppnovel.common.constant.PayOrderStatus;
import org.ppnovel.common.constant.WalletTxnDirection;
import org.ppnovel.common.constant.WalletTxnType;
import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.web.pay.*;
import org.ppnovel.common.entity.novel.NovelChapterEntity;
import org.ppnovel.common.entity.pay.*;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.novel.NovelChapterMapper;
import org.ppnovel.common.mapper.pay.*;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
public class PayService {
    private static final String CHANNEL_MOCK = "MOCK";

    private final WalletService walletService;
    private final WalletMapper walletMapper;
    private final WalletTxnMapper walletTxnMapper;
    private final RechargeOrderMapper rechargeOrderMapper;
    private final ConsumeOrderMapper consumeOrderMapper;
    private final ChapterAccessMapper chapterAccessMapper;
    private final NovelChapterMapper novelChapterMapper;

    public PayService(
        WalletService walletService,
        WalletMapper walletMapper,
        WalletTxnMapper walletTxnMapper,
        RechargeOrderMapper rechargeOrderMapper,
        ConsumeOrderMapper consumeOrderMapper,
        ChapterAccessMapper chapterAccessMapper,
        NovelChapterMapper novelChapterMapper
    ) {
        this.walletService = walletService;
        this.walletMapper = walletMapper;
        this.walletTxnMapper = walletTxnMapper;
        this.rechargeOrderMapper = rechargeOrderMapper;
        this.consumeOrderMapper = consumeOrderMapper;
        this.chapterAccessMapper = chapterAccessMapper;
        this.novelChapterMapper = novelChapterMapper;
    }

    /**
     * 充值流程（幂等）：按 requestId+user 检查已成功订单，创建钱包订单，直接入账并记录流水。
     */
    @Transactional
    public RechargeResponse recharge(RechargeRequest request) {
        Integer userId = SaTokenUtil.getUserId();
        walletService.createWalletIfAbsent(userId);

        RechargeOrderEntity existed = rechargeOrderMapper.selectOne(
            new LambdaQueryWrapper<RechargeOrderEntity>()
                .eq(RechargeOrderEntity::getRequestId, request.getRequestId())
                .eq(RechargeOrderEntity::getUserId, userId)
        );
        // 幂等：相同 requestId 已经成功则直接返回最新余额
        if (existed != null && Objects.equals(existed.getStatus(), PayOrderStatus.SUCCESS)) {
            WalletEntity wallet = walletService.getWallet(userId);
            return buildRechargeResponse(existed.getOrderNo(), wallet);
        }

        String orderNo = NanoIdUtils.randomNanoId();
        RechargeOrderEntity order = new RechargeOrderEntity();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setAmount(request.getAmount());
        order.setStatus(PayOrderStatus.PENDING);
        order.setChannel(CHANNEL_MOCK);
        order.setRequestId(request.getRequestId());
        rechargeOrderMapper.insert(order);

        WalletEntity lockedWallet = walletMapper.lockByUserId(userId);
        if (lockedWallet == null) {
            throw new BusinessException("充值失败，钱包不存在");
        }

        // 模拟支付渠道：直接加钱并记流水
        int updated = walletMapper.increaseBalance(userId, request.getAmount());
        if (updated == 0) {
            throw new BusinessException("充值失败，钱包不存在");
        }

        WalletEntity wallet = walletService.getWallet(userId);
        insertWalletTxn(userId, WalletTxnType.RECHARGE, WalletTxnDirection.IN, request.getAmount(), wallet.getBalance(), order.getId(), WalletTxnType.RECHARGE, request.getRequestId(), "充值");

        order.setStatus(PayOrderStatus.SUCCESS);
        rechargeOrderMapper.updateById(order);

        return buildRechargeResponse(orderNo, wallet);
    }

    /**
     * 查询钱包余额及累计充值/消费，若无则自动创建钱包。
     */
    public BalanceResponse getBalance() {
        Integer userId = SaTokenUtil.getUserId();
        WalletEntity wallet = walletService.createWalletIfAbsent(userId);
        BalanceResponse response = new BalanceResponse();
        response.setBalance(wallet.getBalance());
        response.setTotalRecharge(wallet.getTotalRecharge());
        response.setTotalConsume(wallet.getTotalConsume());
        return response;
    }

    /**
     * 分页查询钱包流水，按创建时间倒序。
     */
    public PageResponse<WalletTxnResponse> listTxns(Integer page, Integer size) {
        Integer userId = SaTokenUtil.getUserId();
        Page<WalletTxnEntity> pageQuery = new Page<>(page, size);
        Page<WalletTxnEntity> pageResult = walletTxnMapper.selectPage(
            pageQuery,
            new LambdaQueryWrapper<WalletTxnEntity>()
                .eq(WalletTxnEntity::getUserId, userId)
                .orderByDesc(WalletTxnEntity::getId)
        );

        PageResponse<WalletTxnResponse> response = new PageResponse<>(pageResult);
        response.setRows(
            pageResult.getRecords().stream().map(this::toWalletTxnResponse).toList()
        );
        return response;
    }

    /**
     * 购买章节（幂等）：检查已购或已有成功订单，校验章节价格，扣款记流水，授权章节访问。
     */
    @Transactional
    public BuyChapterResponse buyChapter(Integer chapterId, BuyChapterRequest request) {
        Integer userId = SaTokenUtil.getUserId();
        walletService.createWalletIfAbsent(userId);

        ChapterAccessEntity existingAccess = chapterAccessMapper.selectOne(
            new LambdaQueryWrapper<ChapterAccessEntity>()
                .eq(ChapterAccessEntity::getUserId, userId)
                .eq(ChapterAccessEntity::getChapterId, chapterId)
        );
        if (existingAccess != null) {
            WalletEntity wallet = walletService.getWallet(userId);
            BuyChapterResponse response = new BuyChapterResponse();
            response.setGranted(true);
            response.setBalance(wallet.getBalance());
            response.setOrderNo(null);
            return response;
        }

        ConsumeOrderEntity existedOrder = consumeOrderMapper.selectOne(
            new LambdaQueryWrapper<ConsumeOrderEntity>()
                .eq(ConsumeOrderEntity::getRequestId, request.getRequestId())
                .eq(ConsumeOrderEntity::getUserId, userId)
        );
        if (existedOrder != null && Objects.equals(existedOrder.getStatus(), PayOrderStatus.SUCCESS)) {
            WalletEntity wallet = walletService.getWallet(userId);
            BuyChapterResponse response = new BuyChapterResponse();
            response.setOrderNo(existedOrder.getOrderNo());
            response.setGranted(true);
            response.setBalance(wallet.getBalance());
            return response;
        }

        NovelChapterEntity chapter = novelChapterMapper.selectById(chapterId);
        if (chapter == null) {
            throw new BusinessException("章节不存在");
        }

        WalletEntity lockedWallet = walletMapper.lockByUserId(userId);
        if (lockedWallet == null) {
            throw new BusinessException("钱包不存在");
        }

        BigDecimal price = Optional.ofNullable(chapter.getPrice()).orElse(BigDecimal.ZERO);
        if (price.compareTo(BigDecimal.ZERO) <= 0) {
            createChapterAccess(userId, chapterId);
            WalletEntity wallet = walletService.getWallet(userId);
            BuyChapterResponse response = new BuyChapterResponse();
            response.setGranted(true);
            response.setBalance(wallet.getBalance());
            response.setOrderNo(null);
            return response;
        }

        if (lockedWallet.getBalance().compareTo(price) < 0) {
            throw new BusinessException("余额不足，请先充值");
        }

        String orderNo = NanoIdUtils.randomNanoId();
        ConsumeOrderEntity order = new ConsumeOrderEntity();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setAmount(price);
        order.setStatus(PayOrderStatus.PENDING);
        order.setBizScene(ConsumeBizType.CHAPTER);
        order.setTargetId(chapterId);
        order.setRequestId(request.getRequestId());
        consumeOrderMapper.insert(order);

        int updated = walletMapper.decreaseBalanceIfEnough(userId, price);
        if (updated == 0) {
            throw new BusinessException("余额不足，请先充值");
        }

        WalletEntity wallet = walletService.getWallet(userId);
        insertWalletTxn(userId, WalletTxnType.CONSUME, WalletTxnDirection.OUT, price, wallet.getBalance(), order.getId(), ConsumeBizType.CHAPTER, request.getRequestId(), "购买章节");

        order.setStatus(PayOrderStatus.SUCCESS);
        consumeOrderMapper.updateById(order);

        createChapterAccess(userId, chapterId);

        BuyChapterResponse response = new BuyChapterResponse();
        response.setOrderNo(orderNo);
        response.setGranted(true);
        response.setBalance(wallet.getBalance());
        return response;
    }

    /**
     * 组装充值响应。
     */
    private RechargeResponse buildRechargeResponse(String orderNo, WalletEntity wallet) {
        RechargeResponse response = new RechargeResponse();
        response.setOrderNo(orderNo);
        response.setBalance(wallet.getBalance());
        return response;
    }

    /**
     * 记录钱包流水。
     */
    private void insertWalletTxn(
        Integer userId,
        String type,
        String direction,
        BigDecimal amount,
        BigDecimal balanceAfter,
        Long bizId,
        String bizType,
        String requestId,
        String remark
    ) {
        WalletTxnEntity txn = new WalletTxnEntity();
        txn.setUserId(userId);
        txn.setType(type);
        txn.setDirection(direction);
        txn.setAmount(amount);
        txn.setBalanceAfter(balanceAfter);
        txn.setBizId(bizId);
        txn.setBizType(bizType);
        txn.setRequestId(requestId);
        txn.setRemark(remark);
        walletTxnMapper.insert(txn);
    }

    /**
     * 流水实体转返回对象。
     */
    private WalletTxnResponse toWalletTxnResponse(WalletTxnEntity entity) {
        WalletTxnResponse response = new WalletTxnResponse();
        response.setType(entity.getType());
        response.setDirection(entity.getDirection());
        response.setAmount(entity.getAmount());
        response.setBalanceAfter(entity.getBalanceAfter());
        response.setBizType(entity.getBizType());
        response.setBizId(entity.getBizId());
        response.setRequestId(entity.getRequestId());
        response.setRemark(entity.getRemark());
        response.setCreatedAt(entity.getCreatedAt());
        return response;
    }

    /**
     * 创建章节访问记录（购买/免费），重复插入忽略。
     */
    private void createChapterAccess(Integer userId, Integer chapterId) {
        ChapterAccessEntity access = new ChapterAccessEntity();
        access.setUserId(userId);
        access.setChapterId(chapterId);
        access.setGrantType("PURCHASE");
        try {
            chapterAccessMapper.insert(access);
        } catch (Exception e) {
            log.warn("chapter access insert duplicate userId={}, chapterId={}", userId, chapterId);
        }
    }
}
