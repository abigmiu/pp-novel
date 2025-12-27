package org.ppnovel.web.controller.novel;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ppnovel.common.dto.web.novel.chapter.CreateChapterReq;
import org.ppnovel.common.dto.web.novel.writer.CreateNovelReq;
import org.ppnovel.common.dto.web.novel.writer.CreateNovelRes;
import org.ppnovel.common.dto.web.novel.writer.UpdateNovelReq;
import org.ppnovel.common.dto.web.novel.writer.WriterSelfNovelListRes;
import org.ppnovel.web.service.novel.WriterChapterService;
import org.ppnovel.web.service.novel.WriterNovelService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "小说-作家")
@RestController()
@RequestMapping("writer-novel")
public class WriterNovelController {

    private final WriterNovelService writerNovelService;
    private final WriterChapterService writerChapterService;

    public WriterNovelController(
        WriterNovelService writerNovelService,
        WriterChapterService writerChapterService
    ) {
        this.writerNovelService = writerNovelService;
        this.writerChapterService = writerChapterService;
    }

    @Operation(summary = "创建小说")
    @PostMapping("create")
    public CreateNovelRes createNovel(@RequestBody @Validated CreateNovelReq req) {
        return writerNovelService.createNovel(req);
    }

    @Operation(summary = "删除小说")
    @DeleteMapping("delete")
    public void deleteNovel(@RequestParam Integer id) {
        writerNovelService.deleteNovel(id);
    }

    @Operation(summary = "更新小说")
    @PutMapping("update")
    public void updateNovel(@RequestBody @Validated UpdateNovelReq req) {
        writerNovelService.updateNovel(req);
    }

    @Operation(summary = "作家书本列表")
    @GetMapping("list")
    public List<WriterSelfNovelListRes> getNovelList() {
        return writerNovelService.getNovelList();
    }

    @Operation(summary = "创建小说章节")
    @PostMapping("chapter-create")
    public void createChapter(@RequestBody @Validated CreateChapterReq req) {
        writerChapterService.createChapter(req);
    }
}
