package org.ppnovel.common.entity.novel;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("novel_relate_category")
public class NovelRelateCategoryEntity {
    /** 小说ID */
    @TableField("novel_id")
    private Integer novelId;

    /** 分类/主题/角色/情节ID（共用分类表） */
    @TableField("category_id")
    private Integer categoryId;

    /**
     * 分类类型：1=category, 2=theme, 3=role, 4=plot
     */
    @TableField("category_type")
    private Integer categoryType;
}
