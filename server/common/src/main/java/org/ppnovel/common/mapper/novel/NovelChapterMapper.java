package org.ppnovel.common.mapper.novel;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.ppnovel.common.entity.novel.NovelChapterEntity;

public interface NovelChapterMapper extends BaseMapper<NovelChapterEntity> {
    @Select("""
        SELECT SUM(CHAR_LENGTH(content))
        FROM novel_chapter
        WHERE book_id = #{bookId}
        """)
    Integer sumContentLength(@Param("bookId") Integer bookId);

    @Select("""
            SELECT COUNT(*)
            FROM novel_chapter
            WHERE book_id = #{bookId}
        """)
    Integer chapterCount(@Param("bookId")  Integer bookId);
}
