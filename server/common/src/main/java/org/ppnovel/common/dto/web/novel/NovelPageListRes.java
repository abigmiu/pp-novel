package org.ppnovel.common.dto.web.novel;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 小说分页响应
 */
@Data
public class NovelPageListRes {

    @Data
    public static class NewestChapter {
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "标题")
        private String title;

        @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "更新时间")
        private LocalDateTime date;

        @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "章节index")
        private Integer idx;
    }

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "封面")
    private String cover;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "id")
    private Integer id;

    /**
     * 书名
     */
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "书名")
    private String title;

    /**
     * 作者名
     */

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "作者名")
    private String author;

    /**
     * 状态
     */
    @Schema(requiredMode =Schema.RequiredMode.REQUIRED, description = "状态")
    private Integer status;

    /**
     * 总字数
     */
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "总字数")
    private String totalWordCount;

    /**
     * 简介
     */
    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "简介")
    private String description;

    /**
     * 最近更新
     */
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "最近更新")
    private NewestChapter newestChapter;
}
