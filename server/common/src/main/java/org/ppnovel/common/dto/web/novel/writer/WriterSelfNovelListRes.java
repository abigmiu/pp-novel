package org.ppnovel.common.dto.web.novel.writer;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;



@Data
public class WriterSelfNovelListRes {
    @Data
    public static class NewestChapter {
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
        private String title;

        @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
        private Integer id;

        @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
        private Integer idx;
    }

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer id;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String cover;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer totalWordCount;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer status;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer totalChapterCount;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private NewestChapter newestChapter;
}
