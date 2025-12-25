package org.ppnovel.web.controller.novel;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ppnovel.common.dto.web.novel.writer.CreateNovelReq;
import org.ppnovel.common.dto.web.novel.writer.CreateNovelRes;
import org.ppnovel.web.service.novel.WriterNovelService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "小说-作家")
@RestController()
@RequestMapping("writer-novel")
public class WriterNovelController {

    private final WriterNovelService writerNovelService;

    public WriterNovelController(
        WriterNovelService writerNovelService
    ) {
        this.writerNovelService = writerNovelService;
    }

    @Operation(summary = "创建小说")
    @PostMapping("create")
    public CreateNovelRes createNovel(@RequestBody @Validated CreateNovelReq req) {
        return writerNovelService.createNovel(req);
    }
}
