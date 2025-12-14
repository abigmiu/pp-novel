package org.ppnovel.web.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class RedisUtil {
    @Autowired
    @Qualifier("appRedisTemplate")
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void set(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public Object get(Object key) {
        return redisTemplate.opsForValue().get(key);
    }

    public Long incr(String key) {
        return redisTemplate.opsForValue().increment(key);
    }

    public void del(String key) {
        redisTemplate.delete(key);
    }

    /**
     * 设置过期时间的值，单位是秒
     * @param key
     * @param value
     * @param time
     */
    public void setex(String key, Object value, long time) {
        redisTemplate.opsForValue().set(key, value, time, TimeUnit.SECONDS);
    }

    // Hash 相关操作 start ----------------------------------------------------------------------------------------------
    /**
     * 从redis中获取map数据
     *
     * @param key
     * @return
     */
    public Map hgetall(String key, Class<?> clazz) {
        try {
            Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);
            Map<Object, Object> result = new HashMap<>();
            for (Map.Entry<Object, Object> entry : entries.entrySet()) {
                System.out.println(entry.getValue().getClass().toString());
                String jsonValue = objectMapper.writeValueAsString(entry.getValue());
                result.put(entry.getKey(), objectMapper.readValue(jsonValue, clazz));
            }
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取map中的指定hashKey对应的数据
     * @param key
     * @param hashKey
     * @return
     */
    public Object hget(String key, String hashKey) {
        try {
            return redisTemplate.opsForHash().get(key, hashKey);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 把map存到redis中
     *
     * @param key
     * @param map
     */
    public void hset(String key, Map map) {
        redisTemplate.opsForHash().putAll(key, map);
    }

    /**
     * 把数据存储在map中指定hashKey的value
     * @param key
     * @param hashKey
     * @param value
     */
    public void hput(String key, String hashKey, Object value) {
        redisTemplate.opsForHash().put(key, hashKey, value);
    }

    /**
     * 删除map中指定hashKey
     * @param key
     * @param hashKeys
     * @return
     */
    public Long hdel(String key, Object... hashKeys) {
        return redisTemplate.opsForHash().delete(key, hashKeys);
    }
}
