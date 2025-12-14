package org.ppnovel.common.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 粉丝和关注统计表
 */
@Data
@TableName("fans_follow")
public class FansFollowEntity {
    /**
     * 用户id
     */
    @TableId(type = IdType.INPUT)
    @TableField("user_id")
    private Integer userId;

    /**
     * 粉丝数量
     */
    @TableField("fans_count")
    private Integer fansCount;

    /**
     * 关注数量
     */
    @TableField("follow_count")
    private Integer followCount;
}
