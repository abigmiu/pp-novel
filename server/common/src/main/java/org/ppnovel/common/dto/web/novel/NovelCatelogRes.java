package org.ppnovel.common.dto.web.novel;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 小说目录返回
 */
@Data
public class NovelCatelogRes {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "标题")
    private String title;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "id")
    private Integer chapterId;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "是否需要付费")
    private boolean feeable;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "是否已经付费")
    private boolean paied;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "章节index")
    private Integer idx;
}
