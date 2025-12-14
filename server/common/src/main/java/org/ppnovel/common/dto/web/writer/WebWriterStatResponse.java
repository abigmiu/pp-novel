package org.ppnovel.common.dto.web.writer;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(title = "web/作家统计数据响应")
@Data
public class WebWriterStatResponse {
    /** 小说数量 */
    @Schema(title = "小说数量", requiredMode = Schema.RequiredMode.REQUIRED)
    private int bookCount;

    /** 短故事数量 */
    @Schema(title = "短故事数量", requiredMode = Schema.RequiredMode.REQUIRED)
    private int shortStoryCount;

    /** 小说章节 */
    @Schema(title = "小说章节", requiredMode = Schema.RequiredMode.REQUIRED)
    private int bookChapterCount;

    /** 小说总字数 */
    @Schema(title = "小说总字数", requiredMode = Schema.RequiredMode.REQUIRED)

    private int bookCharCount;

    /** 短故事总字数 */
    @Schema(title = "短故事总字数", requiredMode = Schema.RequiredMode.REQUIRED)

    private int shortStoryCharCount;


}
