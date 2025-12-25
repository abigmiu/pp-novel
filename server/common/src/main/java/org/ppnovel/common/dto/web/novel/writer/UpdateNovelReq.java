package org.ppnovel.common.dto.web.novel.writer;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class UpdateNovelReq {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "作品id")
    @NotNull
    private Integer id;


    @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "作品名称")
    @NotNull
    private String title;

    @Schema(description = "频道类型：男频/女频")
    private Integer type;

    @Schema(description = "主分类ID列表")
    private List<Integer> categoryIds;

    @Schema(description = "主题ID列表")
    private List<Integer> themeIds;

    @Schema(description = "角色ID列表")
    private List<Integer> roleIds;

    @Schema(description = "情节ID列表")
    private List<Integer> plotIds;

    @Schema(description = "封面地址")
    private String cover;

    @Schema(description = "主角1")
    private String protagonist1;

    @Schema(description = "主角2")
    private String protagonist2;

    @Schema(description = "作品简介")
    private String description;
}
