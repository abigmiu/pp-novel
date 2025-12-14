package org.ppnovel.common.dto.web.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(title = "用户注册响应: WebAuthRegisterResponse")
@Data
public class WebAuthLoginResponse {
    @Schema(title = "token", requiredMode = Schema.RequiredMode.REQUIRED)
    private String token;
    
}
