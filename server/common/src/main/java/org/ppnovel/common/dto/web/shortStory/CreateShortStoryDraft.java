package org.ppnovel.common.dto.web.shortStory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;

import java.util.ArrayList;

@Data
public class CreateShortStoryDraft {
    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "标题-12字以内")
    @Length(min = 1, max = 25, message = "标题长度为25字以内")
    private  String title;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "草稿ID，传入表示更新已有草稿")
    private Integer draftId;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "内容， 100 - 30万字")
    @Length(max = 30 * 10000, message = "内容长度为30万字以内")
    private String content;


    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "推荐封面")
    @URL(message = "未添加推荐封面")
    private String cover;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "头条封面")
    @URL(message = "未添加头条封面")
    private String toutiaoCover;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "试读比例，根据段落分割")
    @Min(value = 1, message = "试读比例")
    @Max(value = 100, message = "试读比例最多100%")
    private Integer freeRate;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "试读段落数，配合试读比例一起使用")
    private Integer freeParagraph;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "推荐标题 - 该标题仅用于短故事在头条推荐分发使用")
    @Length(max = 30, message = "推荐标题长度为30字以内")
    private String recommendTitle;

    @Schema(requiredMode = Schema.RequiredMode.NOT_REQUIRED, description = "作品分类")
    private ArrayList<Integer> categoryIds;
}
