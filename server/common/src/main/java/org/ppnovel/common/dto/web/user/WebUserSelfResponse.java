package org.ppnovel.common.dto.web.user;

import java.time.LocalDateTime;

import org.ppnovel.common.annotation.JsonDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(title = "web 用户响应 - WebUserResponse")
@Data
public class WebUserSelfResponse {
    @Schema(title = "用户 uid", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long uid;

    @Schema(title = "脱敏邮箱", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @Schema(title = "头像", requiredMode = Schema.RequiredMode.REQUIRED)
    private String avatar;

    @Schema(title = "简介", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String desc;

    @Schema(title = "脱敏qq", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String qq;

    @Schema(title = "笔名", requiredMode = Schema.RequiredMode.REQUIRED)
    private String pseudonym;

    @Schema(title = "等级", requiredMode = Schema.RequiredMode.REQUIRED)
    private int level;

    @Schema(title = "经验", requiredMode = Schema.RequiredMode.REQUIRED)
    private int exp;

    @Schema(title = "创建时间", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonDateTime
    private LocalDateTime Date;
}
