package org.ppnovel.common.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;

import lombok.Data;

/** 作家数据 */
@Data
@TableName("writer_stat")
public class WriterStatEntity {
    @TableId(type = IdType.INPUT, value="user_id")
    private Integer userId;

    /** 小说数量 */
    @TableField("book_count")
    private int bookCount;

    /** 短故事数量 */
    @TableField("short_story_count")
    private int shortStoryCount;

    /** 小说章节 */
    @TableField("book_chapter_count")
    private int bookChapterCount;

    /** 小说总字数 */
    @TableField("book_char_count")
    private int bookCharCount;

    /** 短故事总字数 */
    @TableField("short_story_char_count")
    private int shortStoryCharCount;


}
