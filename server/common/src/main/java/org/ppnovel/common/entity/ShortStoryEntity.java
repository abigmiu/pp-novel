package org.ppnovel.common.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@TableName("short_story")
@Data
public class ShortStoryEntity extends BaseEntity {

    /**
     * 故事ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 标题
     */
    @TableField(value = "title")
    private String title;

    /**
     * 内容
     */
    @TableField(value = "content")
    private String content;

    /**
     * 封面
     */
    @TableField(value = "cover")
    private String cover;

    /**
     * 头条封面
     */
    @TableField(value = "toutiao_cover")
    private String toutiaoCover;

    /**
     * 免费阅读比例
     */
    @TableField(value = "free_rate")
    private Integer freeRate;

    /**
     * 试读段落数
     */
    @TableField(value = "free_paragraph")
    private Integer freeParagraph;

    /**
     * 推荐标题
     */
    @TableField(value = "recommend_title")
    private String recommendTitle;

    /**
     * 内容长度
     */
    @TableField(value = "content_length")
    private Integer contentLength;

    /**
     * 作者ID
     */
    @TableField(value = "author_id")
    private Integer authorId;

    /**
     * 状态
     */
    @TableField(value = "status")
    private Integer status;

    /**
     * YJS 文档id
     */
    @TableField(value = "document_name")
    private String documentName;
}
