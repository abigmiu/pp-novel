package org.ppnovel.common.dto.web.notify;

import java.time.LocalDateTime;

import org.apache.commons.lang3.builder.ToStringExclude;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import lombok.Data;

/**
 * 站内信消息列表
 */
@Data
public class NotifyListRes {
    @Schema(
        description = "消息id",
        requiredMode = RequiredMode.REQUIRED,
        type = "string"
    )
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @Schema(
        description = "业务类型",
        requiredMode = RequiredMode.REQUIRED
    )
    private String typeText;

    @Schema(
        description = "标题",
        requiredMode =  RequiredMode.REQUIRED
    )
    private String title;

    @Schema(
        description = "内容",
        requiredMode = RequiredMode.REQUIRED
    )
    private String content;

    @Schema(
        description = "是否已读",
        requiredMode = RequiredMode.REQUIRED
    )
    private boolean hasRead;

    @Schema(
        description = "创建时间",
        requiredMode =  RequiredMode.REQUIRED
    )
    private LocalDateTime createdAt;
}
