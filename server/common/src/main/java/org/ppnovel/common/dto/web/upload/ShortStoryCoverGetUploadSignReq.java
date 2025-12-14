package org.ppnovel.common.dto.web.upload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "获取短故事封面上传请求签名")
@Data
public class ShortStoryCoverGetUploadSignReq {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description= "contentType")
    private String contentType;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "contentLength")
    private Integer contentLength;
}