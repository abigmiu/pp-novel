package org.ppnovel.web.controller.auth;

import cn.dev33.satoken.annotation.SaIgnore;
import cn.dev33.satoken.stp.StpUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ppnovel.common.dto.web.auth.WebAuthLogin;
import org.ppnovel.common.dto.web.auth.WebAuthLoginResponse;
import org.ppnovel.common.dto.web.auth.WebAuthRegister;
import org.ppnovel.web.service.auth.AuthService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "web 用户认证相关")
@RestController
@RequestMapping("/web/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("register")
    @SaIgnore
    @Operation(summary = "作者注册")
    WebAuthLoginResponse register(@RequestBody @Validated WebAuthRegister webAuthRegister) {
        return this.authService.register(webAuthRegister);
    }

    @PostMapping("login")
    @SaIgnore
    @Operation(summary = "登录")
    WebAuthLoginResponse login(@RequestBody @Validated WebAuthLogin data) {
        return this.authService.login(data);
    }

    @PostMapping("logout")
    @SaIgnore
    @Operation(summary = "退出登录")
    public void logout() {
        StpUtil.logout();
    }
}
