package org.ppnovel.web.controller.pay;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ppnovel.common.dto.common.PageResponse;
import org.ppnovel.common.dto.web.pay.*;
import org.ppnovel.web.service.pay.PayService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Tag(name = "付费与钱包")
@RestController
@RequestMapping("/web/pay")
public class PayController {
    private final PayService payService;

    public PayController(PayService payService) {
        this.payService = payService;
    }

    @PostMapping("/recharge")
    @Operation(summary = "充值（自动成功）")
    public RechargeResponse recharge(@RequestBody @Validated RechargeRequest request) {
        return payService.recharge(request);
    }

    @GetMapping("/balance")
    @Operation(summary = "查询余额")
    public BalanceResponse balance() {
        return payService.getBalance();
    }

    @GetMapping("/txns")
    @Operation(summary = "流水列表")
    public PageResponse<WalletTxnResponse> txns(
        @RequestParam(value = "page", defaultValue = "1") Integer page,
        @RequestParam(value = "size", defaultValue = "10") Integer size
    ) {
        return payService.listTxns(page, size);
    }

    @PostMapping("/chapters/{chapterId}/buy")
    @Operation(summary = "购买章节")
    public BuyChapterResponse buyChapter(
        @PathVariable Integer chapterId,
        @RequestBody @Validated BuyChapterRequest request
    ) {
        return payService.buyChapter(chapterId, request);
    }
}
