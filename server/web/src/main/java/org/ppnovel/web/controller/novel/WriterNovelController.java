package org.ppnovel.web.controller.novel;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "小说-作家")
@RestController()
@RequestMapping("writer-novel")
public class WriterNovelController {
    @Operation(summary = "创建小说")
    @PostMapping("create")
    public void createNovel() {

    }
}
