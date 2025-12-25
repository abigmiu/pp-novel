package org.ppnovel.common.entity.novel;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import org.ppnovel.common.entity.BaseEntity;

@Data
@TableName("novel")
public class NovelEntity extends BaseEntity {
    /** 小说ID */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("author_id")
    private Integer authorId;

    /** 小说标题 */
    @TableField("title")
    private String title;

    /** 男频 / 女频 */
    @TableField("type")
    private Integer type;

    /** 封面 */
    @TableField("cover")
    private String cover;

    /** 主角1 */
    @TableField("protagonist1")
    private String protagonist1;

    /** 主角2 */
    @TableField("protagonist2")
    private String protagonist2;

    /** 作品简介 */
    @TableField("description")
    private String description;

    @TableField("status")
    private Integer status;
}
