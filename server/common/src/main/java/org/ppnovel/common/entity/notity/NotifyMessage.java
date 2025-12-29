package org.ppnovel.common.entity.notity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

import org.ppnovel.common.entity.BaseEntity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;

import lombok.Data;

// 消息表

@Data
@TableName("notify_message")
public class NotifyMessage extends BaseEntity {
    @TableId(type = IdType.AUTO)
    @TableField("id")
    private Long id;

    /** 角色 1-reader,2-writer */
    @TableField("role_type")
    private Integer roleType;

    /** 用户id */
    @TableField("user_id")
    private Integer userId;

    /** 业务类型 chapter_update/audit_result */
    @TableField("type")
    private String type;

    /** 标题 */
    @TableField("title")
    private String title;

    /** 内容 */
    @TableField("content")
    private String content;

    /** 跳转url */
    @TableField("action_url")
    private String actionUrl;

    /** 消息通道 1站内信,2WS,4邮件,8短信 */
    @TableField("channel_mask")
    private Integer channelMask;

    /** 消息已读状态 0未读,1已读 */
    @TableField("reader_status")
    private Integer readerStatus;

    /** 已读时间 */
    @TableField("read_at")
    private LocalDateTime readAt;
}
