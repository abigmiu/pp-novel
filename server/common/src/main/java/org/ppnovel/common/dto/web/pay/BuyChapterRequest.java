package org.ppnovel.common.dto.web.pay;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BuyChapterRequest {
    @Schema(description = "请求幂等ID，可用于防重复扣款")
    @NotBlank
    private String requestId;
}
