package org.ppnovel.common.entity.novel;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("novel_category")
public class NovelCategoryEntity {
    @TableField("id")
    private Integer id;
    @TableField("name")
    private String name;
    @TableField("description")
    private String description;
    @TableField("cover")
    private String cover;
    @TableField("parent_id")
    private Integer parentId;
    @TableField("man")
    private boolean man;
    @TableField("woman")
    private boolean woman;
}
