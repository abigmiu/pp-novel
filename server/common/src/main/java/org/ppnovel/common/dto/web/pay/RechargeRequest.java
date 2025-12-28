package org.ppnovel.common.dto.web.pay;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RechargeRequest {
    @Schema(description = "充值金额，单位元")
    @NotNull
    @DecimalMin(value = "0.01", message = "充值金额必须大于0")
    private BigDecimal amount;

    @Schema(description = "请求幂等ID")
    @NotBlank
    private String requestId;
}
