package org.ppnovel.common.dto.web.notify;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import lombok.Data;

@Data
public class NotifyTypeListRes {
    @Schema(requiredMode = RequiredMode.REQUIRED, description = "展示名称")
    private String label;
    
    @Schema(requiredMode = RequiredMode.REQUIRED, description = "值")
    private String value;
}
