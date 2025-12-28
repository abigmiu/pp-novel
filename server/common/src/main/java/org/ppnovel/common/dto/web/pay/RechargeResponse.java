package org.ppnovel.common.dto.web.pay;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RechargeResponse {
    private String orderNo;
    private BigDecimal balance;
}
