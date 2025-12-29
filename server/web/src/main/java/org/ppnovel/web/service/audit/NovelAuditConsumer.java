package org.ppnovel.web.service.audit;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.ppnovel.common.constant.NovelChapterStatus;
import org.ppnovel.common.entity.notity.NotifyMessage;
import org.ppnovel.common.entity.notity.NotifyTemplate;
import org.ppnovel.common.entity.novel.NovelChapterEntity;
import org.ppnovel.common.mapper.notify.NotifyMessageMapper;
import org.ppnovel.common.mapper.notify.NotifyTemplateMapper;
import org.ppnovel.common.mapper.novel.NovelChapterMapper;
import org.ppnovel.common.mq.ChapterToAuditMessage;
import org.ppnovel.web.component.RedisUtil;
import org.ppnovel.web.configuration.RabbitConfiguration;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class NovelAuditConsumer {
    private final NovelChapterMapper novelChapterMapper;
    private final NotifyMessageMapper notifyMessageMapper;
    private final NotifyTemplateMapper notifyTemplateMapper;
    private final RedisUtil redisUtil;

    public NovelAuditConsumer(
        NovelChapterMapper novelChapterMapper, 
        NotifyMessageMapper notifyMessageMapper,
        RedisUtil redisUtil,
        NotifyTemplateMapper notifyTemplateMapper
    ) {
        this.novelChapterMapper = novelChapterMapper;
        this.notifyMessageMapper = notifyMessageMapper;
        this.notifyTemplateMapper = notifyTemplateMapper;
        this.redisUtil = redisUtil;
    }

    /** 通知审核结果 */
    private void notifyChapterAuditStatus(
        Integer chapterId
    ) {

        LambdaQueryWrapper<NotifyTemplate> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NotifyTemplate::isEnable, true)
            .eq(NotifyTemplate::getType, "chapter_audit")
            .last("limit 1");
        NotifyTemplate foundTemplate = notifyTemplateMapper.selectOne(queryWrapper);
        if (foundTemplate == null) {
            log.info("章节审核模板未找到");
        }


        
        NovelChapterEntity foundChapter = novelChapterMapper.selectById(chapterId);
        String title = foundChapter.getTitle();
        Integer status = foundChapter.getStatus();
        
        String resultText;
        if (status == NovelChapterStatus.CHECK_SUCCESS) {
            resultText = "通过";
        } else if (status == NovelChapterStatus.CHECK_FAIL) {
            resultText = "不通过";
        } else {
            resultText = "异常";
        }
        
        String titleTemplate = foundTemplate.getTitleTpl();
        String contentTemplate = foundTemplate.getContentTpl();

        Map<String, String> params = Map.of(
            "resultText", resultText,
            "chapterTitle", title
        );

        for (Map.Entry<String, String> e: params.entrySet()) {
            titleTemplate = titleTemplate.replace("{" + e.getKey() + "}", e.getValue());
            contentTemplate = contentTemplate.replace("{" + e.getKey() + "}", e.getValue());
        }


        NotifyMessage notifyMessage = new NotifyMessage();
        notifyMessage.setUserId(foundChapter.getAuthorId());
        notifyMessage.setChannelMask(1);
        notifyMessage.setRoleType(2);
        notifyMessage.setType("chapter_audit");
        notifyMessage.setTitle(titleTemplate);
        notifyMessage.setContent(contentTemplate);
        String unreadRedisKey = "unread:writer:" + foundChapter.getAuthorId();
        Integer redisUnread = (Integer) redisUtil.get(unreadRedisKey);
        redisUtil.set(unreadRedisKey, redisUnread + 1);


        notifyMessageMapper.insert(notifyMessage);
    }

    @RabbitListener(queues = RabbitConfiguration.CHAPTER_AUDIT_QUEUE)
    public void handleChapterAudit(
            ChapterToAuditMessage message,
            Channel channel,
            Message mqMessage) throws IOException {
        long deliveryTag = mqMessage.getMessageProperties().getDeliveryTag();
        boolean shouldAck = true;

        try {
            log.info("开始处理章节审核消息: userId={}, chapterId={}",
                    message.getUserId(), message.getChapterId());

            // 模拟审核结果
            boolean hasPass = ThreadLocalRandom.current().nextBoolean();
            Integer newStatus = hasPass ? NovelChapterStatus.CHECK_SUCCESS : NovelChapterStatus.CHECK_FAIL;

            // 直接基于当前状态做条件更新，避免多余查询
            LambdaUpdateWrapper<NovelChapterEntity> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(NovelChapterEntity::getAuthorId, message.getUserId());
            updateWrapper.eq(NovelChapterEntity::getId, message.getChapterId());
            updateWrapper.eq(NovelChapterEntity::getStatus, NovelChapterStatus.PENDING_CHECK);
            updateWrapper.set(NovelChapterEntity::getStatus, newStatus);

            int updateCount = novelChapterMapper.update(null, updateWrapper);

            if (updateCount > 0) {
                log.info("章节审核完成: chapterId={}, result={}",
                        message.getChapterId(), hasPass ? "通过" : "失败");
                return;
            }

            // 未更新成功，查询当前状态以决定下一步
            LambdaQueryWrapper<NovelChapterEntity> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(NovelChapterEntity::getAuthorId, message.getUserId());
            queryWrapper.eq(NovelChapterEntity::getId, message.getChapterId());

            NovelChapterEntity currentData = novelChapterMapper.selectOne(queryWrapper);
            if (currentData == null) {
                log.warn("章节审核未找到数据: {}", message);
                return;
            }

            if (!NovelChapterStatus.PENDING_CHECK.equals(currentData.getStatus())) {
                log.info("章节已审核，跳过处理: chapterId={}, currentStatus={}",
                        message.getChapterId(), currentData.getStatus());
                return;
            }

            log.warn("章节审核更新失败，状态仍为待审核，可能并发冲突: chapterId={}", message.getChapterId());
        } catch (Exception e) {
            log.error("章节审核处理异常: userId={}, chapterId={}",
                    message.getUserId(), message.getChapterId(), e);
            // 不可恢复错误，拒绝消息并进入死信队列
            channel.basicReject(deliveryTag, false);
            shouldAck = false;
            return;
        } finally {
            if (shouldAck) {
                channel.basicAck(deliveryTag, false);
                notifyChapterAuditStatus(message.getChapterId());;
            }
        }
    }
}
