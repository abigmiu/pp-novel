package org.ppnovel.common.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@TableName("short_story_relate_category")
@Data
public class ShortStoryRelateCategoryEntity {
    /**
     * 故事ID
     */
    @TableField(value = "story_id")
    private Integer storyId;

    @TableField(value = "category_id")
    private Integer categoryId;
}
