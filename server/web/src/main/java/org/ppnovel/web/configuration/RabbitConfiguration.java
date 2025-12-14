package org.ppnovel.web.configuration;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitConfiguration {
    public static final String EMAIL_QUEUE = "ppnovel-email.queue";
    public static final String EMAIL_EXCHANGE = "ppnovel-email.exchange";
    public static final String EMAIL_ROUTING_KEY = "ppnovel-email.send";

    @Bean
    public Queue emailQueue() {
        return new Queue(EMAIL_QUEUE, true);
    }

    @Bean
    public DirectExchange emailExchange() {
        return new DirectExchange(EMAIL_EXCHANGE);
    }

    @Bean
    public Binding emailBinding() {
        return BindingBuilder
            .bind(emailQueue())
            .to(emailExchange())
            .with(EMAIL_ROUTING_KEY);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
        ConnectionFactory connectionFactory,
        MessageConverter messageConverter
    ) {
        RabbitTemplate template = new RabbitTemplate( connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}
