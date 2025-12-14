package org.ppnovel.web.controller.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ppnovel.common.dto.web.user.WebUserFansFollowStatRes;
import org.ppnovel.common.dto.web.user.WebUserSelfResponse;
import org.ppnovel.web.service.user.UserService;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "web 用户")
@RestController
@RequestMapping("/web/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "获取自身用户信息")
    @GetMapping("self")
    public WebUserSelfResponse getUserSelfInfo() {
        return userService.getSelfUseInfo();
    }

    @Operation(summary = "获取关注和粉丝统计数据")
    @GetMapping("self-fans-follow")
    public WebUserFansFollowStatRes getUserFansFollowInfo() {
        Integer userId = SaTokenUtil.getUserId();
        return userService.getUserFansFollowStatRes(userId);
    }

    @Operation(summary = "test")
    @GetMapping("test")
    public void test() {
    }
}
