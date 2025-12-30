package org.ppnovel.common.es;

import lombok.Data;

@Data
public class ChapterESDoc {
    private Integer id;
    private String title;
    private Integer authorId;
    private String authorName;
    private String content;
}
