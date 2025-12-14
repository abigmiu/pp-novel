package org.ppnovel.common.dto.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageQuery {
    @Nullable
    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "页数")
    private Integer page = 1;

    @Nullable
    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "每页量")
    private Integer size = 10;
}
