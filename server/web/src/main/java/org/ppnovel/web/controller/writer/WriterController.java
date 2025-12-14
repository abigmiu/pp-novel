package org.ppnovel.web.controller.writer;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ppnovel.common.dto.web.writer.WebWriterStatResponse;
import org.ppnovel.web.service.writer.WriterService;
import org.ppnovel.web.util.SaTokenUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "作者")
@RestController
@RequestMapping("/web/writer")
public class WriterController {
    private WriterService writerService;

    public WriterController(WriterService writerService) {
        this.writerService = writerService;
    }

    @Operation(summary = "获取作者的统计数据")
    @GetMapping("stat")
    public WebWriterStatResponse stat() {
        Integer userId = SaTokenUtil.getUserId();
        return writerService.stat(userId);
    }
}
