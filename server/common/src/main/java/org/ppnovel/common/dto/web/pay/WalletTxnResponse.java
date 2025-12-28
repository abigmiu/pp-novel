package org.ppnovel.common.dto.web.pay;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class WalletTxnResponse {
    private String type;
    private String direction;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String bizType;
    private Long bizId;
    private String requestId;
    private LocalDateTime createdAt;
    private String remark;
}
