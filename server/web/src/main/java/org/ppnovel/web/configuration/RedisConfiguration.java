package org.ppnovel.web.configuration;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.util.StringUtils;

@Configuration
public class RedisConfiguration {
    @Value("${spring.data.redis.keyPrefix}")
    private String redisKeyPrefix;

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory factory) {
        StringRedisTemplate stringRedisTemplate = new StringRedisTemplate();
        stringRedisTemplate.setConnectionFactory(factory);
        stringRedisTemplate.setKeySerializer(new RedisPrefixSerializer());
        return stringRedisTemplate;
    }

    @Bean
    public RedisTemplate<String, Object> appRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        template.setConnectionFactory(redisConnectionFactory);

        // 序列化配置
        // json的序列化
        ObjectMapper om = new ObjectMapper();       // 对象类序列化过程中用 ObjectMapper 进行转义
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.deactivateDefaultTyping();
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(om, Object.class);    // 用json序列化任意对象类

        // String的序列化
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

        // key采用了String的序列化方式
        template.setKeySerializer(new RedisPrefixSerializer());
        // hash的key也采用String的序列化方式
        template.setHashKeySerializer(new StringRedisSerializer());


        // value序列化方式采用jackson
        template.setValueSerializer(jackson2JsonRedisSerializer);
        // hash的value序列化方式采用jackson
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();

        return template;
    }

    private class RedisPrefixSerializer extends StringRedisSerializer {
        @Override
        public byte[] serialize(String s) {
            if (s == null) {
                return new byte[0];
            }
            // 这里加上你需要加上的key前缀
            String realKey = redisKeyPrefix + s;
            return super.serialize(realKey);
        }

        @Override
        public String deserialize(byte[] bytes) {
            String s = bytes == null ? null : new String(bytes);
            if (!StringUtils.hasLength(s)) {
                return s;
            }
            int index = s.indexOf(redisKeyPrefix);
            if (index != -1) {
                return s.substring(redisKeyPrefix.length());
            }
            return s;
        }
    }
}

