package org.ppnovel.web.service.auth;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.constant.EmailType;
import org.ppnovel.common.dto.web.auth.WebAuthLogin;
import org.ppnovel.common.dto.web.auth.WebAuthLoginResponse;
import org.ppnovel.common.dto.web.auth.WebAuthRegister;
import org.ppnovel.common.entity.UserEntity;
import org.ppnovel.common.entity.WriterStatEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.FansFollowMapper;
import org.ppnovel.common.mapper.UserMapper;
import org.ppnovel.common.mapper.WriterStatMapper;
import org.ppnovel.common.utils.EncryptUtil;
import org.ppnovel.web.component.RedisUtil;
import org.ppnovel.web.service.pay.WalletService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {
    private final FansFollowMapper fansFollowMapper;
    @Value("${auth.register-code}")
    private boolean needRegisterCode;

    private final UserMapper userMapper;
    private final WriterStatMapper writerStatMapper;
    private final RedisUtil redisUtil;
    private final WalletService walletService;

    public AuthService(
        UserMapper userMapper,
        RedisUtil redisUtil,
        WriterStatMapper writerStatMapper,
        FansFollowMapper fansFollowMapper,
        WalletService walletService
    ) {
        this.writerStatMapper = writerStatMapper;
        this.userMapper = userMapper;
        this.redisUtil = redisUtil;
        this.fansFollowMapper = fansFollowMapper;
        this.walletService = walletService;
    }

    /**
     * 初始作者化写作数据
     */
    private void initWriterData(Integer userId) {
        QueryWrapper<WriterStatEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        WriterStatEntity foundData = writerStatMapper.selectOne(queryWrapper);
        if (foundData != null) {
            return;
        }

        WriterStatEntity writerStatEntity = new WriterStatEntity();
        writerStatEntity.setUserId(userId);
        writerStatEntity.setBookCount(0);
        writerStatEntity.setBookChapterCount(0);
        writerStatEntity.setBookCharCount(0);

        writerStatEntity.setShortStoryCount(0);
        writerStatEntity.setShortStoryCharCount(0);
    }


    /**
     * 注册
     *
     * @param body
     * @return
     */
    public WebAuthLoginResponse register(WebAuthRegister body) {
        QueryWrapper<UserEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", body.getEmail());
        UserEntity userEntity = userMapper.selectOne(queryWrapper);
        if (userEntity != null) {
            throw new BusinessException("邮箱已存在");
        }

        // 检查邮箱验证码
        String redisEmailCode = "code:" + EmailType.REGISTER + ":" + body.getEmail();
        String emailCode = (String) redisUtil.get(redisEmailCode);

        if (this.needRegisterCode) {
            if (emailCode == null) {
                throw new BusinessException("验证码已过期");
            }
            if (!emailCode.equals(body.getCode())) {
                throw new BusinessException("验证码错误");
            }
        }


        UserEntity newUser = createNewUser(body);
        userMapper.insert(newUser);
        walletService.createWalletIfAbsent(newUser.getId());

        initWriterData(newUser.getId());

        redisUtil.setex(redisEmailCode, emailCode, 60);
        return createLoginResponse(newUser);
    }

    public WebAuthLoginResponse login(WebAuthLogin body) {
        QueryWrapper<UserEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", body.getEmail());
        String signedPassword = EncryptUtil.encryptWebUserPassword(body.getPassword());
        queryWrapper.eq("password", signedPassword);
        UserEntity user = userMapper.selectOne(queryWrapper);
        if (user == null) {
            throw new BusinessException("账号或密码错误");
        }

        return createLoginResponse(user);

    }

    private WebAuthLoginResponse createLoginResponse(UserEntity user) {
        WebAuthLoginResponse response = new WebAuthLoginResponse();
        StpUtil.login(user.getId());
        String token = StpUtil.getTokenValue();
        response.setToken(token);
        return response;
    }

    /**
     * 生成用户uid
     */
    private Long generateUid() {
        Long uid = redisUtil.incr("uid");
        return uid;
    }

    private UserEntity createNewUser(WebAuthRegister body) {
        UserEntity user = new UserEntity();
        Long uid = generateUid();
        user.setUid(uid);
        user.setEmail(body.getEmail());
        String signedPassword = EncryptUtil.encryptWebUserPassword(body.getPassword());
        user.setPassword(signedPassword);
        user.setPseudonym("用户" + uid);
        return user;
    }
}
