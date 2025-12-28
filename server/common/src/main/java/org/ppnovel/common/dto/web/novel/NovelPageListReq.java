package org.ppnovel.common.dto.web.novel;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.ppnovel.common.dto.common.PageQuery;

@Data
public class NovelPageListReq extends PageQuery {
    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "分类")
    private Integer category;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "字数区间")
    private Integer wordCount;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "状态")
    private Integer status;
}
