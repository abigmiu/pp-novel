package org.ppnovel.common.dto.web.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * web 用户粉丝和关注统计响应
 */
@Schema(title = "web 用户粉丝和关注统计响应 - WebUserFansFollowStatRes ")
@Data
public class WebUserFansFollowStatRes {
    @Schema(title = "粉丝数量", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer fansCount;

    @Schema(title = "关注数量", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer followCount;
}
