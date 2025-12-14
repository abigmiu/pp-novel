package org.ppnovel.common.dto.web.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Schema(title = "web 用户注册")
@Data
public class WebAuthRegister {
    @Email(message = "邮箱格式不正确")
    @Schema(title = "邮箱", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "邮箱不能为空")
    private String email;

    @Pattern(regexp = "^\\w{8,20}$", message = "密码为 8 - 20 字母数字组合")
    @Schema(title = "密码", description = "密码为 8 - 20 字母数字组合", requiredMode = Schema.RequiredMode.REQUIRED, defaultValue = "123456789")
    String password;

    @NotBlank(message = "验证码不能为空")
    @Schema(title = "验证码", requiredMode = Schema.RequiredMode.REQUIRED, defaultValue = "1234")
    String code;
}
