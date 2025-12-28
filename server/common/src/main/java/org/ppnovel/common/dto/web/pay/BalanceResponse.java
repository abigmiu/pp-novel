package org.ppnovel.common.dto.web.pay;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BalanceResponse {
    private BigDecimal balance;
    private BigDecimal totalRecharge;
    private BigDecimal totalConsume;
}
