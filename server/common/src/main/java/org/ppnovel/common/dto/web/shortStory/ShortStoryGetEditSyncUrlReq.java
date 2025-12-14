package org.ppnovel.common.dto.web.shortStory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description =  "获取短故事编辑器yjs同步url")
@Data
public class ShortStoryGetEditSyncUrlReq {
    @Schema(requiredMode =  Schema.RequiredMode.REQUIRED, description = "短故事id")
    private Integer id;
}
