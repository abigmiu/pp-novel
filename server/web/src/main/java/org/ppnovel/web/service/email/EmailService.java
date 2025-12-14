package org.ppnovel.web.service.email;

import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.constant.EmailType;

import org.ppnovel.common.mq.EmailMessage;
import org.ppnovel.web.component.RedisUtil;
import org.ppnovel.web.configuration.RabbitConfiguration;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
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

    @Value("${custom.testReceiveAccount}")
    private String customTestReceiveAccount;

    private final RedisUtil redisUtil;
    private final RabbitTemplate rabbitTemplate;


    public EmailService(
        RabbitTemplate rabbitTemplate,
        RedisUtil redisUtil
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.redisUtil = redisUtil;
    }

    public  void sendTestMail() {
        EmailMessage emailMessage = new EmailMessage();
        emailMessage.setTo(customTestReceiveAccount);
        emailMessage.setContent("测试邮件发送内容·1");
        emailMessage.setSubject("注册邮件发送");
        emailMessage.setType(EmailType.REGISTER);
        rabbitTemplate.convertAndSend(RabbitConfiguration.EMAIL_EXCHANGE, RabbitConfiguration.EMAIL_ROUTING_KEY, emailMessage);

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


        EmailMessage emailMessage = new EmailMessage();
        emailMessage.setTo(to);
        emailMessage.setContent(mailContent);
        emailMessage.setSubject("注册验证码");
        emailMessage.setType(EmailType.REGISTER);
        rabbitTemplate.convertAndSend(RabbitConfiguration.EMAIL_EXCHANGE, RabbitConfiguration.EMAIL_ROUTING_KEY, emailMessage);

        log.info("注册验证码 {}", mailContent);

    }
}
