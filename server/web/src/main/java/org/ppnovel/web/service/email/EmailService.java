package org.ppnovel.web.service.email;

import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.constant.EmailType;

import org.ppnovel.web.component.RedisUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Random;

@Slf4j
@Service
public class EmailService {
    @Value("${spring.profiles.active}")
    private String env;

    @Value("${spring.mail.username}")
    private String mailFrom;

    private final JavaMailSender javaMailSender;
    private final RedisUtil redisUtil;

    public EmailService(
        JavaMailSender javaMailSender,
        RedisUtil redisUtil
    ) {
        this.javaMailSender = javaMailSender;
        this.redisUtil = redisUtil;
    }

    public void sendMail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        javaMailSender.send(message);
    }

    /**
     * 发送注册验证码
     *
     * @param to
     */
    public void sendRegisterCode(String to) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(random.nextInt(10));
        }
        String code = sb.toString();

        String mailContent = "您的注册验证码是 " + code + " 有效时间30分钟";
        redisUtil.setex("code:" + EmailType.REGISTER + ":" + to, code, 30 * 60);

        if (!Objects.equals(env, "dev")) {
            sendMail(to, "注册验证码", mailContent);
        } else {
            log.info("注册验证码 {}", mailContent);
        }
    }
}
