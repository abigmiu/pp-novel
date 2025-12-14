package org.ppnovel.web.controller.shortStory;

import cn.dev33.satoken.annotation.SaIgnore;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import org.ppnovel.common.dto.web.shortStory.ShortStoryGetEditSyncUrlReq;
import org.ppnovel.common.dto.web.shortStory.ShortStoryGetEditSyncUrlRes;
import org.ppnovel.common.dto.web.shortStory.ShortStoryValidateYJSTokenReq;
import org.ppnovel.common.entity.ShortStoryEntity;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.common.mapper.ShortStoryMapper;
import org.ppnovel.web.service.shortStory.ShortStoryService;
import org.ppnovel.web.service.shortStory.ShortStoryWriteService;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@Tag(name = "短故事编辑")
@RestController
@RequestMapping("shortStoryEdit")
@Slf4j
public class ShortStoryWriteController {

    private final ShortStoryService shortStoryService;
    private final ShortStoryMapper shortStoryMapper;
    private final ShortStoryWriteService shortStoryWriteService;

    public ShortStoryWriteController(
            ShortStoryMapper shortStoryMapper,
            ShortStoryService shortStoryService,
            ShortStoryWriteService shortStoryWriteService) {
        this.shortStoryMapper = shortStoryMapper;
        this.shortStoryService = shortStoryService;
        this.shortStoryWriteService = shortStoryWriteService;
    }

    @Operation(summary = "获取yjs 连接信息")
    @GetMapping("syncUrl")
    public ShortStoryGetEditSyncUrlRes getYJSConnectInfo(@Validated ShortStoryGetEditSyncUrlReq shortStoryGetEditSyncUrlReq) {

        return shortStoryWriteService.getYJSConnectInfo(shortStoryGetEditSyncUrlReq.getId());

    }


    @Operation(summary = "校验 yjs token 有效性")
    @GetMapping("validateToken")
    @SaIgnore
    public Boolean getMethodName(@Validated ShortStoryValidateYJSTokenReq req) {
        return shortStoryWriteService.validateTokenEffictive(req.getToken());
    }
    

}
