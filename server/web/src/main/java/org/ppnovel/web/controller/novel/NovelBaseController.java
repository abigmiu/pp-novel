package org.ppnovel.web.controller.novel;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import org.ppnovel.common.dto.web.novel.common.NovelCategoryRes;
import org.ppnovel.web.service.novel.NovelBaseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "小说公共接口")
@RestController
@RequestMapping("novel-common")
public class NovelBaseController {
    private final NovelBaseService novelBaseService;
    public NovelBaseController(
        NovelBaseService novelBaseService
    ) {
        this.novelBaseService = novelBaseService;
    }
    @Operation(summary = "获取小说分类")
    @GetMapping("category")
    public List<NovelCategoryRes> getNovelCategories(@RequestParam(name = "type") @Min(1) Integer type) {
        return novelBaseService.getNovelCategory(type);

    }
}
