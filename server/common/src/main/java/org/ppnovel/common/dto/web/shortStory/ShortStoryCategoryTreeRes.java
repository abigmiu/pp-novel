package org.ppnovel.common.dto.web.shortStory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.lang.reflect.Array;
import java.util.ArrayList;

@Schema(description = "短故事分类树型结构")
@Data
public class ShortStoryCategoryTreeRes {
    /**
     * id
     */
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "id")
    private Integer id;

    /**
     * 名称
     */
    @Schema(description = "名称", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    /**
     * 封面图
     */
    @Schema(description = "封面图", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String coverUrl;

    /**
     * 子结构
     */
    @Schema(description = "子结构", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private ArrayList<ShortStoryCategoryTreeRes> children;
}
