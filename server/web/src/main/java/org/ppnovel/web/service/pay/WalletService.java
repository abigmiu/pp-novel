package org.ppnovel.web.service.pay;

import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.entity.pay.WalletEntity;
import org.ppnovel.common.mapper.pay.WalletMapper;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
public class WalletService {
    private final WalletMapper walletMapper;

    public WalletService(WalletMapper walletMapper) {
        this.walletMapper = walletMapper;
    }

    /**
     * 若钱包不存在则创建，存在则直接返回。
     */
    public WalletEntity createWalletIfAbsent(Integer userId) {
        WalletEntity existing = walletMapper.findByUserId(userId);
        if (existing != null) {
            return existing;
        }
        WalletEntity wallet = new WalletEntity();
        wallet.setUserId(userId);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setTotalRecharge(BigDecimal.ZERO);
        wallet.setTotalConsume(BigDecimal.ZERO);
        try {
            walletMapper.insert(wallet);
        } catch (DuplicateKeyException duplicateKeyException) {
            log.warn("wallet already exists for userId={}", userId);
        }
        return walletMapper.findByUserId(userId);
    }

    /**
     * 查询用户钱包，不存在返回 null。
     */
    public WalletEntity getWallet(Integer userId) {
        return walletMapper.findByUserId(userId);
    }
}
