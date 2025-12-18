package org.ppnovel.common.dto.web.upload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "响应：获取短故事封面上传请求签名")
@Data
public class ShortStoryCoverGetUploadSignRes {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description= "上传地址")
    private String uploadUrl;

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "预览地址")
    private String downloadUrl;
}
