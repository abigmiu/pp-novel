package org.ppnovel.common.dto.web.notify;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import lombok.Data;

/**
 * 读者模块未读数量响应
 */
@Data
public class ReaderUnreadCountRes {
    @Schema(requiredMode = RequiredMode.REQUIRED, description = "未读数量")
    private Integer count;
}
