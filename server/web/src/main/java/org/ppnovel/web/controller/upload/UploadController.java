package org.ppnovel.web.controller.upload;

import io.swagger.v3.oas.annotations.Operation;
import org.ppnovel.common.dto.web.upload.ShortStoryCoverGetUploadSignReq;
import org.ppnovel.common.dto.web.upload.ShortStoryCoverGetUploadSignRes;
import org.ppnovel.web.service.upload.AliUploadService;
import org.ppnovel.web.service.upload.UploadService;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "文件上传")
@RestController
@RequestMapping("upload")
public class UploadController {
    private AliUploadService aliUploadService;

    public UploadController(AliUploadService aliUploadService) {
        this.aliUploadService = aliUploadService;
    }


    @Operation(summary = "获取短故事封面上传预签名url")
    @PostMapping("shortStoryCover")
    public ShortStoryCoverGetUploadSignRes getShortStoryCoverUploadUrl(@RequestBody ShortStoryCoverGetUploadSignReq data)  {
        return aliUploadService.getShortStoryCoverUploadUrl(data);
    }


}
