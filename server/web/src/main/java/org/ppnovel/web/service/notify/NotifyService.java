package org.ppnovel.web.service.notify;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.web.notify.BatchReadReq;
import org.ppnovel.common.dto.web.notify.CreateNotifyTemplateReq;
import org.ppnovel.common.dto.web.notify.NotifyListReq;
import org.ppnovel.common.dto.web.notify.NotifyListRes;
import org.ppnovel.common.dto.web.notify.NotifyTypeListRes;
import org.ppnovel.common.dto.web.notify.ReaderUnreadCountRes;
import org.ppnovel.common.dto.web.notify.NotifyTemplateRes;
import org.ppnovel.common.dto.web.notify.WriterUnreadCountRes;
import org.ppnovel.common.entity.notity.NotifyMessage;
import org.ppnovel.common.entity.notity.NotifyTemplate;
import org.ppnovel.common.mapper.notify.NotifyMessageMapper;
import org.ppnovel.common.mapper.notify.NotifyTemplateMapper;
import org.ppnovel.web.component.RedisUtil;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

@Service
public class NotifyService {
    private RedisUtil redisUtil;
    private final NotifyTemplateMapper notifyTemplateMapper;
    private final NotifyMessageMapper notifyMessageMapper;

    public NotifyService(
        RedisUtil redisUtil,
        NotifyTemplateMapper notifyTemplateMapper,
        NotifyMessageMapper notifyMessageMapper
    ) {
        this.redisUtil = redisUtil;
        this.notifyMessageMapper    = notifyMessageMapper;
        this.notifyTemplateMapper = notifyTemplateMapper;
    }

    /** 
     * 作家模块未读数量
     */
    public WriterUnreadCountRes getWriterUnreadCount()  {
        Integer authorId = SaTokenUtil.getUserId();

        String unreadRedisKey = "unread:writer:" + authorId;
        Integer redisUnread = (Integer) redisUtil.get(unreadRedisKey);

        WriterUnreadCountRes res = new WriterUnreadCountRes();
        if (redisUnread != null) {
            res.setCount(redisUnread);
            return res;
        }    

        LambdaQueryWrapper<NotifyMessage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NotifyMessage::getUserId, authorId);
        queryWrapper.eq(NotifyMessage::getType, 1); // 站内信
        queryWrapper.eq(NotifyMessage::getRoleType, 2);
        Long count = notifyMessageMapper.selectCount(queryWrapper);
        res.setCount(count.intValue());
        redisUtil.set(unreadRedisKey, count.intValue());

        return res;
    }

    /** 读者未读数量 */
    public ReaderUnreadCountRes getReaderUnreadCount() {
        Integer readerId = SaTokenUtil.getUserId();
        String unreadRedisKey = "unread:reader:" + readerId;
        Integer redisUnread = (Integer) redisUtil.get(unreadRedisKey);

        ReaderUnreadCountRes res = new ReaderUnreadCountRes();
        if (redisUnread != null) {
            res.setCount(redisUnread);
            return res;
        }    
        LambdaQueryWrapper<NotifyMessage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NotifyMessage::getUserId, readerId);
        queryWrapper.eq(NotifyMessage::getType, 1); // 站内信
        queryWrapper.eq(NotifyMessage::getRoleType, 1);
        Long count = notifyMessageMapper.selectCount(queryWrapper);
        res.setCount(count.intValue());
        redisUtil.set(unreadRedisKey, count.intValue());
        
            
        return res;
    }

    /** 消息批量已读 */
    @Transactional
    public void batchRead(BatchReadReq req) {
        Integer userId = SaTokenUtil.getUserId();
            LocalDateTime now = LocalDateTime.now();

        LambdaUpdateWrapper<NotifyMessage> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(NotifyMessage::getUserId, userId)
                    .in(NotifyMessage::getId, req.getIds())
                    .eq(NotifyMessage::getReaderStatus, 1)
                    .set(NotifyMessage::getReadAt, now);
        notifyMessageMapper.update(null, updateWrapper);

        redisUtil.del("unread:reader:" + userId);
        redisUtil.del("unread:writer:" + userId);

    }

    /**
     * 创建消息模板， 这里应该按角色弄， 暂时不弄
     */
    public void createNotifyTemplate(CreateNotifyTemplateReq req) {
        NotifyTemplate notifyTemplate = new NotifyTemplate();
        notifyTemplate.setName(req.getName());
        notifyTemplate.setChannelMask(req.getChannelMask());
        notifyTemplate.setContentTpl(req.getContentTpl());
        notifyTemplate.setTitleTpl(req.getTitleTpl());
        notifyTemplate.setType(req.getType());
        
        notifyTemplateMapper.insert(notifyTemplate);
    }

    /** 获取所有消息模板 */
    public List<NotifyTemplateRes> getNotifyTemplateList() {
        LambdaQueryWrapper<NotifyTemplate> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(NotifyTemplate::getCreatedAt);
        List<NotifyTemplate> templateList = notifyTemplateMapper.selectList(queryWrapper);

        return templateList.stream().map((item) -> {
            NotifyTemplateRes res = new NotifyTemplateRes();
            res.setId(item.getId());
            res.setName(item.getName());
            res.setType(item.getType());
            res.setChannelMask(item.getChannelMask());
            res.setTitleTpl(item.getTitleTpl());
            res.setContentTpl(item.getContentTpl());
            res.setEnable(item.isEnable());
            return res;
        }).toList();
    }

    /** 返回消息通知业务类型列表 */

    public List<NotifyTypeListRes> getNotifyTypeListRes() {
        List<NotifyTypeListRes> res = new ArrayList<>();
        NotifyTypeListRes item1 = buildNotifyTypeListRes("章节审核", "chapter_audit");
        res.add(item1);
        NotifyTypeListRes item2 = buildNotifyTypeListRes("书本审核", "novel_audit");
        res.add(item2);
        NotifyTypeListRes item3 = buildNotifyTypeListRes("短故事审核", "short_story_audit");
        res.add(item3);

        return res;
        
    }

    /** 作者站内信列表 */
    public PageResponse<NotifyListRes> getWriterNotifyList(NotifyListReq req) {
        Integer userId = SaTokenUtil.getUserId();
        LambdaQueryWrapper<NotifyMessage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NotifyMessage::getUserId, userId);
        queryWrapper.orderByDesc(NotifyMessage::getCreatedAt);
        queryWrapper.eq(NotifyMessage::getChannelMask, 1); // 站内信
        queryWrapper.eq(NotifyMessage::getRoleType, 2);

        Page<NotifyMessage> pageQuery = new Page<>(req.getPage(), req.getSize());
        Page<NotifyMessage> pageResult = notifyMessageMapper.selectPage(pageQuery, queryWrapper);

        PageResponse<NotifyListRes> response = new PageResponse<>(pageResult);
        response.setRows(
            pageResult
                .getRecords()
                .stream()
                .map((item) -> {
                    NotifyListRes resItem = new NotifyListRes();
                    resItem.setContent(item.getContent());
                    resItem.setTitle(item.getTitle());
                    resItem.setHasRead(item.getReaderStatus() == 1);
                    resItem.setId(item.getId());
                    resItem.setTypeText(item.getType());
                    resItem.setCreatedAt(item.getCreatedAt());
                    return resItem;
                }).toList()
        );

        return response;

    }

    /** 读者站内信列表 */
    public PageResponse<NotifyListRes> getReaderNotifyList(NotifyListReq req) {
        Integer userId = SaTokenUtil.getUserId();
        LambdaQueryWrapper<NotifyMessage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(NotifyMessage::getUserId, userId);
        queryWrapper.orderByDesc(NotifyMessage::getCreatedAt);
        queryWrapper.eq(NotifyMessage::getType, 1); // 站内信
        queryWrapper.eq(NotifyMessage::getRoleType, 1);

        Page<NotifyMessage> pageQuery = new Page<>(req.getPage(), req.getSize());
        Page<NotifyMessage> pageResult = notifyMessageMapper.selectPage(pageQuery, queryWrapper);

        PageResponse<NotifyListRes> response = new PageResponse<>(pageResult);
        response.setRows(
            pageResult
                .getRecords()
                .stream()
                .map((item) -> {
                    NotifyListRes resItem = new NotifyListRes();
                    resItem.setContent(item.getContent());
                    resItem.setTitle(item.getTitle());
                    resItem.setHasRead(item.getReaderStatus() == 1);
                    resItem.setId(item.getId());
                    resItem.setTypeText(item.getType());
                    return resItem;
                }).toList()
        );

        return response;

    }

    private NotifyTypeListRes buildNotifyTypeListRes(String label, String value) {
        NotifyTypeListRes item1 = new NotifyTypeListRes();
        item1.setLabel(label);
        item1.setValue(value);
        return item1;
    }
    
}
