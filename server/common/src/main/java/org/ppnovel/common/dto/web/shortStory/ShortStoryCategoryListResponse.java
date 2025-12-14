package org.ppnovel.common.dto.web.shortStory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "短故事分类列表")
@Data
public class ShortStoryCategoryListResponse {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "id")
    private Integer id;
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "名称")
    private String name;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "主分类")
    private String label;
    
    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "图片")
    private String cover;
}
