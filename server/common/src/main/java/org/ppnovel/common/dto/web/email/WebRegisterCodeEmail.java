package org.ppnovel.common.dto.web.email;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(name = "RegisterCodeEmail - 发送注册验证码请求参数")
@Data
public class WebRegisterCodeEmail {
    @Schema(description = "邮箱", requiredMode = Schema.RequiredMode.REQUIRED)
    @Email(message = "邮箱格式不正确")
    @NotBlank(message = "邮箱不能为空")
    private String email;
}
