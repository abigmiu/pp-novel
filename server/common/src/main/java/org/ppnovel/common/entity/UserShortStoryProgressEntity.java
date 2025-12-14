package org.ppnovel.common.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("user_short_story_progress")
public class UserShortStoryProgressEntity {

    /**
     * ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    @TableField(value = "user_id")
    private Integer userId;

    /**
     * 短故事ID
     */
    @TableField(value = "short_story_id")
    private Integer shortStoryId;

    /**
     * 阅读时长（秒）
     */
    @TableField(value = "reading_time")
    private Integer readingTime;
}
