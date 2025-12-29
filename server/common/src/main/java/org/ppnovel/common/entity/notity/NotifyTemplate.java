package org.ppnovel.common.entity.notity;

import org.ppnovel.common.entity.BaseEntity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

// 消息模板表

@Data
@TableName("notify_template")
public class NotifyTemplate extends BaseEntity {
    @TableId(type = IdType.AUTO)
    @TableField("id")
    private Integer id;

    /** 展示名称 */
    @TableField("name")
    private String name;

    /** 业务类型 chapter_update/audit_result */
    @TableField("type")
    private String type;

    /** 消息通道 1站内信,2WS,4邮件,8短信 */
    @TableField("channel_mask")
    private Integer channelMask;

    /** 标题 */
    @TableField("title_tpl")
    private String titleTpl;

    /** 内容 */
    @TableField("content_tpl")
    private String contentTpl;

    /** 是否启用 */
    @TableField("enable")
    private boolean enable;
}
