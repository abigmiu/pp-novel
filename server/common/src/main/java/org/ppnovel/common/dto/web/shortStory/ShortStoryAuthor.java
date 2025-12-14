package org.ppnovel.common.dto.web.shortStory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "短故事作者信息")
@Data
public class ShortStoryAuthor {
    @Schema(description = "作者ID")
    private Integer id;

    @Schema(description = "作者名称")
    private String name;

    @Schema(description = "作者头像")
    private String avatar;
}
