package org.ppnovel.common.dto.web.shortStory;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class SubmitReadingProgress {
    @Min(1)
    private Integer storyId;

    @Min(0)
    private Integer readingTime; // in seconds
}
