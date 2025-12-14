package org.ppnovel.web.service.email;

import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.mq.EmailMessage;
import org.ppnovel.web.configuration.RabbitConfiguration;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class EmailConsumer {
    @Value("${spring.mail.username}")
    private String mailFrom;

    private final JavaMailSender javaMailSender;

    public EmailConsumer(
        JavaMailSender javaMailSender
    ) {
        this.javaMailSender = javaMailSender;
    }

    @RabbitListener(queues = RabbitConfiguration.EMAIL_QUEUE)
    public void handleEmail(EmailMessage msg) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(msg.getTo());
            message.setSubject(msg.getSubject());
            message.setText(msg.getContent());

            javaMailSender.send(message);
            log.info("邮件发送成功: {}", msg.getTo());

        } catch (Exception e) {
            log.error("邮件发送失败: {}", msg.getTo(), e);
            throw e; // 让 MQ 重试 / 进入死信队列
        }
    }
}
