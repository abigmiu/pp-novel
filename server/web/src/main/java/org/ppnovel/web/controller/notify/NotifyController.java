package org.ppnovel.web.controller.notify;

import java.util.List;

import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.web.notify.BatchReadReq;
import org.ppnovel.common.dto.web.notify.CreateNotifyTemplateReq;
import org.ppnovel.common.dto.web.notify.NotifyListReq;
import org.ppnovel.common.dto.web.notify.NotifyListRes;
import org.ppnovel.common.dto.web.notify.NotifyTypeListRes;
import org.ppnovel.common.dto.web.notify.ReaderUnreadCountRes;
import org.ppnovel.common.dto.web.notify.WriterUnreadCountRes;
import org.ppnovel.web.service.notify.NotifyService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("notify")
@Tag(name = "通知")
public class NotifyController {
    private final NotifyService notifyService;

    public NotifyController(
        NotifyService notifyService
    ) {
        this.notifyService = notifyService;
    }

    @Operation(summary = "创建消息模板")
    @PostMapping("create-template")
    public void postMethodName(@RequestBody CreateNotifyTemplateReq req) {
        notifyService.createNotifyTemplate(req);
    }

    @Operation(summary = "获取消息模板业务类型")
    @GetMapping("template-type-list")
    public List<NotifyTypeListRes> getNotifyTypeListRes() {
        return notifyService.getNotifyTypeListRes();
    }
    

    @Operation(summary = "作者站内信列表")
    @PostMapping("writer-site-message")
    public PageResponse<NotifyListRes> getWriterNotifyList(@RequestBody NotifyListReq req) {
        return notifyService.getWriterNotifyList(req);
    }
    
    @Operation(summary = "读者站内信列表")
    @PostMapping("reader-site-message")
    public PageResponse<NotifyListRes> getReaderNotifyList(@RequestBody NotifyListReq req) {
        return notifyService.getReaderNotifyList(req);
    }
    

    @Operation(summary = "获取读者站内信未读数量")
    @GetMapping("reader-site-unread")
    public ReaderUnreadCountRes getReaderUnreadCount() {
        return notifyService.getReaderUnreadCount();
    }

    @Operation(summary = "获取作者站内信未读数量")
    @GetMapping("writer-site-unread")
    public WriterUnreadCountRes getWriterUnreadCount() {
        return notifyService.getWriterUnreadCount();
    }
    

    @Operation(summary = "消息批量已读")
    @PostMapping("batch-read")
    public void batchRead(@RequestBody BatchReadReq req) {
        notifyService.batchRead(req);
    }
    
}
