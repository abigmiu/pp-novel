package org.ppnovel.web.service.novel;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import org.ppnovel.common.constant.NovelChapterStatus;
import org.ppnovel.common.dto.web.novel.chapter.CreateChapterReq;
import org.ppnovel.common.entity.novel.NovelChapterEntity;
import org.ppnovel.common.entity.novel.NovelEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.novel.NovelChapterMapper;
import org.ppnovel.common.mapper.novel.NovelMapper;
import org.ppnovel.common.mq.ChapterToAuditMessage;
import org.ppnovel.web.configuration.RabbitConfiguration;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class WriterChapterService {

    private final RabbitTemplate rabbitTemplate;

    private final NovelChapterMapper chapterMapper;
    private final NovelMapper novelMapper;

    public WriterChapterService(
            NovelChapterMapper chapterMapper,
            NovelMapper novelMapper, RabbitTemplate rabbitTemplate) {
        this.chapterMapper = chapterMapper;
        this.novelMapper = novelMapper;
        this.rabbitTemplate = rabbitTemplate;
    }

    public Integer getBookMaxIdx(Integer authorId, Integer bookId) {
        Object obj = chapterMapper.selectObjs(
                new LambdaQueryWrapper<NovelChapterEntity>()
                        .select(NovelChapterEntity::getChapterIdx)
                        .eq(NovelChapterEntity::getAuthorId, authorId)
                        .eq(NovelChapterEntity::getBookId, bookId)
                        .orderByDesc(NovelChapterEntity::getChapterIdx)
                        .last("limit 1"))
                .stream()
                .findFirst()
                .orElse(0);
        return ((Number) obj).intValue();
    }

    @Transactional
    public void createChapter(CreateChapterReq req) {
        Integer authorId = SaTokenUtil.getUserId();
        NovelEntity novel = novelMapper.selectOne(new LambdaQueryWrapper<NovelEntity>()
                .eq(NovelEntity::getId, req.getBookId())
                .eq(NovelEntity::getAuthorId, authorId)
                .select(NovelEntity::getId, NovelEntity::getAuthorId));
        if (novel == null) {
            throw new BusinessException("小说不存在或无权限");
        }

        Integer maxIdx = getBookMaxIdx(authorId, req.getBookId());
        if (maxIdx + 1 != req.getChapterIdx()) {
            throw new BusinessException("max chapter idx is " + maxIdx);
        }

        int contentLength = Optional.ofNullable(req.getContent())
                .map(String::length)
                .orElse(0);

        NovelChapterEntity entity = new NovelChapterEntity();
        entity.setAuthorId(authorId);
        entity.setTitle(req.getTitle());
        entity.setBookId(req.getBookId());
        entity.setChapterIdx(req.getChapterIdx());
        entity.setContent(req.getContent());
        entity.setStatus(NovelChapterStatus.PENDING_CHECK);
        entity.setAuthorRemark(req.getAuthorRemark());
        entity.setPrice(req.getPrice() == null ? BigDecimal.ZERO : req.getPrice());
        chapterMapper.insert(entity);

        LambdaUpdateWrapper<NovelEntity> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(NovelEntity::getId, req.getBookId());
        updateWrapper.eq(NovelEntity::getAuthorId, authorId);
        updateWrapper.setSql("word_count = word_count + " + contentLength);
        novelMapper.update(null, updateWrapper);

        // 提交审核
        sendChapterToAudit(authorId, entity.getId());
    }

    private void sendChapterToAudit(Integer userId, Integer chapterId) {
        ChapterToAuditMessage message = new ChapterToAuditMessage();
        message.setUserId(userId);
        message.setChapterId(chapterId);
        rabbitTemplate.convertAndSend(
                RabbitConfiguration.CHAPTER_AUDIT_EXCHANGE,
                RabbitConfiguration.CHAPTER_AUDIT_ROUTING_KEY,
                message

        );
    }
}
