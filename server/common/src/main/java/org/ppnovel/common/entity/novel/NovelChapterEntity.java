package org.ppnovel.common.entity.novel;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("novel_chapter")
public class NovelChapterEntity {
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("chapter_idx")
    private Integer chapterIdx;

    @TableField("title")
    private String title;

    @TableField("content")
    private String content;

    @TableField("author_id")
    private Integer authorId;

    @TableField("author_remark")
    private String authorRemark;


    @TableField("book_id")
    private Integer bookId;

    @TableField("status")
    private Integer status;

    @TableField("price")
    private BigDecimal price;
}
