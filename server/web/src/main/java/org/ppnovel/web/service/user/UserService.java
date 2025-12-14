package org.ppnovel.web.service.user;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.dto.web.user.WebUserFansFollowStatRes;
import org.ppnovel.common.entity.FansFollowEntity;
import org.ppnovel.common.entity.UserEntity;
import org.ppnovel.common.dto.web.user.WebUserSelfResponse;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.FansFollowMapper;
import org.ppnovel.common.mapper.UserMapper;
import org.ppnovel.common.utils.EncryptUtil;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class UserService {
    private final UserMapper userMapper;
    private final FansFollowMapper fansFollowMapper;
    private final UserInitService userInitService;

    public UserService(
        UserMapper userMapper,
        FansFollowMapper fansFollowMapper,
        UserInitService userInitService
    ) {

        this.userMapper = userMapper;
        this.fansFollowMapper = fansFollowMapper;
        this.userInitService = userInitService;
    }

    public WebUserSelfResponse getSelfUseInfo() {
        Integer id = SaTokenUtil.getUserId();
        log.info("id: {}", id);
        QueryWrapper<UserEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", id);
        UserEntity userEntity = userMapper.selectOne(queryWrapper);
        if (userEntity == null) {
            throw new BusinessException("用户不存在");
        }
        WebUserSelfResponse response = new WebUserSelfResponse();
        response.setUid(userEntity.getUid());
        response.setEmail(EncryptUtil.emailDesensitization(userEntity.getEmail()));
        response.setQq(EncryptUtil.qqDesensitization(userEntity.getQq()));
        response.setAvatar(
            Optional.ofNullable(userEntity.getAvatar())
                .orElse("https://s21.ax1x.com/2025/11/16/pZPjLOP.webp")
        );
        response.setDesc(userEntity.getDesc());
        response.setExp(userEntity.getExp());
        response.setLevel(getUserLevel(userEntity.getExp()));
        response.setPseudonym(userEntity.getPseudonym());

        return response;
    }


    /**
     * 获取用户粉丝和关注统计
     */
    public WebUserFansFollowStatRes getUserFansFollowStatRes(Integer userId) {

        LambdaQueryWrapper<FansFollowEntity> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(FansFollowEntity::getUserId, userId);

        WebUserFansFollowStatRes res = new WebUserFansFollowStatRes();
        FansFollowEntity fansFollowEntity = fansFollowMapper.selectOne(queryWrapper);

        if (fansFollowEntity == null) {
            res.setFansCount(0);
            res.setFollowCount(0);
            userInitService.initFansFollowStat(userId);
        } else {
            res.setFansCount(fansFollowEntity.getFansCount());
            res.setFollowCount(fansFollowEntity.getFollowCount());
        }
        log.info("getUserFansFollowStatRes userId: {}", userId);
        return res;
    }

    private Integer getUserLevel(Integer exp) {
        Integer[] levelsExp = new Integer[7];
        levelsExp[0] = 1000;
        levelsExp[1] = 2000;
        levelsExp[2] = 5000;
        levelsExp[3] = 10000;
        levelsExp[4] = 20000;
        levelsExp[5] = 50000;
        levelsExp[6] = 100000;
        for (int i = levelsExp.length - 1; i >= 0; i--) {
            if (exp > levelsExp[i]) {
                return i;
            }
        }
        return 0;
    }
}
