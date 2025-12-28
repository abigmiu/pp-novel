package org.ppnovel.common.dto.web.novel;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 小说详情向右看
 */
@Data
public class NovelDetailRes {
    @Data
    public static class NewestChapter {
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "标题")
        private String title;

        @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "更新时间")
        private LocalDateTime date;

        @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "章节index")
        private Integer idx;
    }

    @Data
    public static class CategoryItem {
        @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
        private String title;

        @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
        private Integer id;
    }

    @Schema(description = "标题", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Schema(description = "id", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer novelId;

    @Schema(description = "封面", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String cover;

    @Schema(description = "简介", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String description;

    @Schema(description = "最新章节", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private NewestChapter newestChapter;

    @Schema(description = "分类", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<CategoryItem> categoryItems;

    @Schema(description = "作者名", requiredMode = Schema.RequiredMode.REQUIRED)
    private String author;

    @Schema(description = "作者id", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer authorId;
}
