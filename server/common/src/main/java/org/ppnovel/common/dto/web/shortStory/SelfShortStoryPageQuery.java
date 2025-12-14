package org.ppnovel.common.dto.web.shortStory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ppnovel.common.constant.ShortStoryStatus;
import org.ppnovel.common.dto.common.PageQuery;
import org.springframework.lang.Nullable;

@Schema(description = "自己的短故事分页查询参数")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SelfShortStoryPageQuery extends C {

    @Nullable
    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "发布状态")
    private Integer status;

    // TODO: 枚举校验
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "创建时间（DESC 或者 ASC）")
    private String dateSort;
}

@Data
class C extends PageQuery {
    private String x;
}