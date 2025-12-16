package org.ppnovel.web.service.email;

import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.mq.EmailMessage;
import org.ppnovel.web.configuration.RabbitConfiguration;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.amqp.RabbitProperties;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;

import java.io.IOException;


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
    public void handleEmail(EmailMessage msg, Channel channel, Message mqMessage) throws IOException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(msg.getTo());
        message.setSubject(msg.getSubject());
        message.setText(msg.getContent());
        try {


            javaMailSender.send(message);
            channel.basicAck(
                mqMessage.getMessageProperties().getDeliveryTag(),
                false
            );
            log.info("邮件发送成功: {}", msg.getTo());

        } catch (MailSendException e) {
            // 临时失败，重试
            channel.basicNack(
                mqMessage.getMessageProperties().getDeliveryTag(),
                false,
                true
            );
        } catch (Exception e) {
            // 不可恢复错误，丢弃或死信
            channel.basicReject(
                mqMessage.getMessageProperties().getDeliveryTag(),
                false
            );
        }
    }
}
