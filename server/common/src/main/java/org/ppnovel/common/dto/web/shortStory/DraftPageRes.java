package org.ppnovel.common.dto.web.shortStory;

import lombok.Data;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 草稿分页返回
 */
@Data
public class DraftPageRes {
    private Integer id;

    @Nullable
    private String cover;

    @Nullable
    private String title;

    private Integer contentLength;

    private List<ShortStoryCategorySimpleListItem> categories;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
