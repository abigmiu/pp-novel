package org.ppnovel.common.dto.web.shortStory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "短故事详情")
public class ShortStoryDetailResponse {
    @Schema(description = "短故事id")
    private Integer id;

    @Schema(description = "标题")
    private String title;

    @Schema(description = "详细内容")
    private String content;

    @Schema(description = "封面图")
    private String cover;

    @Schema(description = "头条封面")
    private String toutiaoCover;

    @Schema(description = "试读比例")
    private Integer freeRate;

    @Schema(description = "试读段落")
    private Integer freeParagraph;

    @Schema(description = "推荐标题")
    private String recommendTitle;

    @Schema(description = "内容长度")
    private Integer contentLength;

    @Schema(description = "更新日期")
    private LocalDateTime updatedAt;

    @Schema(description = "作者信息")
    private ShortStoryAuthor author;
}
