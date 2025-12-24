package org.ppnovel.common.dto.common;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.Data;

import java.util.List;

@Data
public class PageResponse<T> {

    private Long page;
    private Long size;
    private Long total;
    private List<?> rows;

    public PageResponse(Page<?> pageResult) {
        this.page = pageResult.getPages();
        this.size = pageResult.getSize();
        this.total = pageResult.getTotal();
        this.rows = pageResult.getRecords();
    }


}
