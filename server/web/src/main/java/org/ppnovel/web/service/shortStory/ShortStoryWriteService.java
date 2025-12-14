package org.ppnovel.web.service.shortStory;

import org.ppnovel.common.dto.web.shortStory.ShortStoryGetEditSyncUrlRes;
import org.ppnovel.common.entity.ShortStoryEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.ShortStoryMapper;
import org.ppnovel.web.component.RedisUtil;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.stereotype.Service;
import com.aventrix.jnanoid.jnanoid.NanoIdUtils;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import cn.dev33.satoken.stp.StpUtil;

@Service
public class ShortStoryWriteService {

    private final ShortStoryMapper shortStoryMapper;
    private final RedisUtil redisUtil;

    public ShortStoryWriteService(
            ShortStoryMapper shortStoryMapper,
            RedisUtil redisUtil) {
        this.shortStoryMapper = shortStoryMapper;
        this.redisUtil = redisUtil;
    }

    /** 获取yjs连接配置配置 */
    public ShortStoryGetEditSyncUrlRes getYJSConnectInfo(Integer storyId) {
        Integer userId = SaTokenUtil.getUserId();
        QueryWrapper<ShortStoryEntity> queryWrapper = new QueryWrapper<>();

        queryWrapper.eq("authorId", userId)
                .eq("id", storyId);

        ShortStoryEntity shortStoryEntity = shortStoryMapper.selectOne(queryWrapper);
        if (shortStoryEntity == null) {
            throw new BusinessException("故事不存在");
        }

        String documentName = shortStoryEntity.getDocumentName();

        if (documentName == null) {
            documentName = NanoIdUtils.randomNanoId();
        }

        String token = NanoIdUtils.randomNanoId();
        redisUtil.setex(token, 1, 5 * 60);

        ShortStoryGetEditSyncUrlRes shortStoryGetEditSyncUrlRes = new ShortStoryGetEditSyncUrlRes();
        shortStoryGetEditSyncUrlRes.setToken(token);
        shortStoryGetEditSyncUrlRes.setDocumentName(documentName);

        return shortStoryGetEditSyncUrlRes;
    }

    public boolean validateTokenEffictive(String token) {
        Integer value = (Integer) redisUtil.get(token);

        if (value == null ){
            return false;
        }

        return true;

    }
}
