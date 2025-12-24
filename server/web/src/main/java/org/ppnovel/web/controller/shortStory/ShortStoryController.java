package org.ppnovel.web.controller.shortStory;

import cn.dev33.satoken.annotation.SaIgnore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;
import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.common.Result;
import org.ppnovel.common.dto.web.shortStory.*;
import org.ppnovel.common.exception.BusinessException;
import org.ppnovel.web.service.shortStory.ShortStoryService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Tag(name = "短故事")
@RestController
@RequestMapping("shortStory")
@Slf4j
public class ShortStoryController {
    private final ShortStoryService shortStoryService;

    public ShortStoryController(ShortStoryService shortStoryService) {
        this.shortStoryService = shortStoryService;
    }

    @Operation(summary = "创建短故事")
    @PostMapping("create")
    public void createShortStory(@RequestBody @Validated CreateShortStory createShortStory) {
        shortStoryService.createShortStory(createShortStory);
    }

    @Operation(summary = "提交短故事为草稿")
    @PostMapping("draft")
    public void draftShortStory(@RequestBody @Validated CreateShortStoryDraft reqBody) {
        shortStoryService.createShortStoryDraft(reqBody);
    }

    @SaIgnore
    @Operation(summary = "获取短故事详情")
    @GetMapping("detail/{storyId}")
    public ShortStoryDetailResponse detailShortStory(@PathVariable(name = "storyId") @Min(1) Long storyId) {
        return shortStoryService.getShortStoryDetail(storyId);
    }

    @Operation(summary = "获取自己的短故事分页数据")
    @GetMapping("self/page")
    public PageResponse selfPageShortStory(SelfShortStoryPageQuery pageQuery) {
        System.out.println(pageQuery);
        String dateSort = pageQuery.getDateSort();
        if (dateSort.isEmpty()) {
            throw new BusinessException("dateSort不能为空");
        }
        if (!"desc".equalsIgnoreCase(dateSort) && !"asc".equalsIgnoreCase(dateSort)) {
            throw new BusinessException("dateSort只能为desc或者asc");
        }

        return shortStoryService.getSelfShortPageData(pageQuery);
    }

    @Operation(summary =  "获取自己的短故事草稿-分页")
    @PostMapping("self/draft-page")
    public PageResponse<DraftPageRes> selfDraftPageQuery(@RequestBody @Validated DraftPageReq pageQuery) {
        return  shortStoryService.getSelfDraftPageData(pageQuery);
    }

    @SaIgnore
    @Operation(summary = "提交阅读进度")
    @PostMapping("progress")
    public void submitReadingProgress(@RequestBody @Validated SubmitReadingProgress submitReadingProgress) {
        shortStoryService.submitReadingProgress(submitReadingProgress);
    }
}
