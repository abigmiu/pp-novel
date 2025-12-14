package org.ppnovel.common.dto.web.shortStory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description =  "响应：获取短故事编辑器yjs同步url")
@Data
public class ShortStoryGetEditSyncUrlRes {
    @Schema(requiredMode =  Schema.RequiredMode.REQUIRED, description = "yjs documentName")
    private String documentName;


    @Schema(requiredMode =  Schema.RequiredMode.REQUIRED, description = "yjs token")
    private String token;

}
