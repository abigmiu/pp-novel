package org.ppnovel.common.dto.web.novel.chapter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateChapterReq {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "标题")
    @NotNull
    private String title;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "章节索引")
    @NotNull
    private Integer chapterIdx;

    private String content;

    private String authorRemark;

    private Integer bookId;

    @Schema(description = "价格，单位元，默认0为免费")
    private BigDecimal price;
}
