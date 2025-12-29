package org.ppnovel.common.mq;

import lombok.Data;

/** 文章提交审核 */
@Data
public class ChapterToAuditMessage {
    private Integer userId;

    private Integer chapterId;
}
