package org.ppnovel.common.dto.web.shortStory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description =  "请求：校验短故事编辑器yjstoken")
@Data
public class ShortStoryValidateYJSTokenReq {
    @Schema(requiredMode =  Schema.RequiredMode.REQUIRED, description = "短故事id")
    private String token;
}
