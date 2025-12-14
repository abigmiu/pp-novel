package org.ppnovel.web.controller.email;

import cn.dev33.satoken.annotation.SaIgnore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.ppnovel.common.dto.web.email.WebRegisterCodeEmail;
import org.ppnovel.web.service.email.EmailService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "邮件")
@RestController
@RequestMapping("/email")
public class EmailController {
    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @Operation(summary = "发送测试邮件")
    @PostMapping("test")
    @SaIgnore
    public void test() {
        this.emailService.sendTestMail();
    }

    @Operation(summary = "发送邮件验证码")
    @PostMapping("registerCode")
    @SaIgnore
    public void sendRegisterCode(@RequestBody @Validated WebRegisterCodeEmail webRegisterCodeEmail) {
        emailService.sendRegisterCode(webRegisterCodeEmail.getEmail());
    }
}
