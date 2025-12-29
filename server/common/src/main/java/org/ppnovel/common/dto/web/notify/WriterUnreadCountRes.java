package org.ppnovel.common.dto.web.notify;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 作家模块未读数量
 */
@Data
public class WriterUnreadCountRes {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "未读数量")
    private Integer count;

}
