package org.ppnovel.common.entity.notity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

/**
 * 消息投送记录
 */
@Data
@TableName("notify_delivery")
public class NotifyDelivery {
    @TableId(type = IdType.AUTO)
    @TableField("id")
    private Long id;

    /** 消息记录 */
    @TableField("message_id")
    private Long messageId;

    /** 投送状态 0 待发， 1成功 2失败 */
    @TableField("status")
    private Integer status;

    /** 重试次数 */
    @TableField("retry_count")
    private Integer retryCount;

    /** 投送时间 */
    @TableField("delivered_at")
    private LocalDateTime deliveredAt;
}
