package org.ppnovel.common.dto.web.novel.common;

import lombok.Data;

@Data
public class NovelCategoryRes {
    private Integer id;
    private String name;
    private String description;
    private String cover;
    private Integer parentId;
    private String parentName;
    private Integer type;
}
