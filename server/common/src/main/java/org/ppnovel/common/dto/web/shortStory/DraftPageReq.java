package org.ppnovel.common.dto.web.shortStory;

import lombok.Data;
import org.ppnovel.common.dto.common.PageQuery;

@Data
public class DraftPageReq extends PageQuery {
    private boolean DataSortDesc = true;
}
