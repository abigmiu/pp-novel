package org.ppnovel.web.controller.novel;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import org.apache.ibatis.annotations.Param;
import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.web.novel.NovelCatelogRes;
import org.ppnovel.common.dto.web.novel.NovelPageListReq;
import org.ppnovel.common.dto.web.novel.NovelPageListRes;
import org.ppnovel.common.dto.web.novel.common.NovelCategoryRes;
import org.ppnovel.web.service.novel.NovelBaseService;
import org.springframework.web.bind.annotation.*;

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

    @Operation(summary = "获取小说分页数据")
    @PostMapping("page-list")
    public PageResponse<NovelPageListRes> getNovelPageList(@RequestBody NovelPageListReq req) {
        return novelBaseService.getNovelPageList(req);
    }

    @Operation(summary = "获取小说目录")
    @GetMapping("catalog")
    public List<NovelCatelogRes> getNovelCatalog(@Param("id") Integer novelId) {
        return   novelBaseService.getNovelCatalog(novelId);
    }
}
