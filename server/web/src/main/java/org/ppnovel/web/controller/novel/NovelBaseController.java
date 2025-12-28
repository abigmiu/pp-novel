package org.ppnovel.web.controller.novel;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.web.novel.NovelCatelogRes;
import org.ppnovel.common.dto.web.novel.NovelDetailRes;
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
    public List<NovelCatelogRes> getNovelCatalog(@RequestParam("id") Integer novelId) {
        return   novelBaseService.getNovelCatalog(novelId);
    }

    @Operation(summary = "小说详情")
    @GetMapping("detail")
    public NovelDetailRes  getNovelDetail(@RequestParam("id") Integer id) {
        return novelBaseService.getNovelDetail(id);
    }

    @Operation(summary = "收藏小说")
    @PostMapping("favorite")
    public void favoriteNovel(@RequestParam("id") Integer novelId) {
        novelBaseService.favoriteNovel(novelId);
    }

    @Operation(summary = "取消收藏小说")
    @DeleteMapping("favorite")
    public void cancelFavoriteNovel(@RequestParam("id") Integer novelId) {
        novelBaseService.cancelFavoriteNovel(novelId);
    }

    @Operation(summary = "点赞小说")
    @PostMapping("like")
    public void likeNovel(@RequestParam("id") Integer novelId) {
        novelBaseService.likeNovel(novelId);
    }

    @Operation(summary = "取消点赞小说")
    @DeleteMapping("like")
    public void cancelLikeNovel(@RequestParam("id") Integer novelId) {
        novelBaseService.cancelLikeNovel(novelId);
    }

    @Operation(summary = "追更小说")
    @PostMapping("follow")
    public void followNovel(@RequestParam("id") Integer novelId) {
        novelBaseService.followNovel(novelId);
    }

    @Operation(summary = "取消追更小说")
    @DeleteMapping("follow")
    public void cancelFollowNovel(@RequestParam("id") Integer novelId) {
        novelBaseService.cancelFollowNovel(novelId);
    }
}
