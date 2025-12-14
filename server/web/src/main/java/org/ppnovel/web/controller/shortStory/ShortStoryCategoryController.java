package org.ppnovel.web.controller.shortStory;

import cn.dev33.satoken.annotation.SaIgnore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ppnovel.common.dto.web.shortStory.ShortStoryCategoryListResponse;
import org.ppnovel.web.service.shortStory.ShortStoryCategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@Tag(name = "短故事分类")
@RestController()
@RequestMapping("shortStoryCategory")
public class ShortStoryCategoryController {
    private final ShortStoryCategoryService shortStoryCategoryService;

    public ShortStoryCategoryController(ShortStoryCategoryService shortStoryCategoryService) {
        this.shortStoryCategoryService = shortStoryCategoryService;
    }


    @Operation(summary = "获取分类列表")
    @GetMapping("list")
    @SaIgnore
    public ArrayList<ShortStoryCategoryListResponse> getShortStoryCategoryList() {
        return shortStoryCategoryService.getCategoryList();
    }
}
