package org.ppnovel.common.dto.web.pay;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BuyChapterResponse {
    private String orderNo;
    private boolean granted;
    private BigDecimal balance;
}
