package org.ppnovel.common.dto.web.notify;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import lombok.Data;

@Data
public class NotifyTemplateRes {
    @Schema(description = "模板ID", requiredMode = RequiredMode.REQUIRED, type = "string")
    @JsonSerialize(using = ToStringSerializer.class)
    private Integer id;

    @Schema(description = "展示名称", requiredMode = RequiredMode.REQUIRED)
    private String name;

    @Schema(description = "业务类型", requiredMode = RequiredMode.REQUIRED)
    private String type;

    @Schema(description = "消息通道 1站内信,2WS,4邮件,8短信", requiredMode = RequiredMode.REQUIRED)
    private Integer channelMask;

    @Schema(description = "消息标题模板", requiredMode = RequiredMode.REQUIRED)
    private String titleTpl;

    @Schema(description = "消息内容模板", requiredMode = RequiredMode.REQUIRED)
    private String contentTpl;

    @Schema(description = "是否启用", requiredMode = RequiredMode.REQUIRED)
    private boolean enable;
}
