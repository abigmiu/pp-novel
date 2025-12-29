package org.ppnovel.common.dto.web.notify;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import lombok.Data;

/** 消息批量已读 */
@Data
public class BatchReadReq {
    @Schema(
        description = "已读id列表",
        requiredMode = RequiredMode.REQUIRED
    )
    private List<Long> ids;
}
