package org.ppnovel.common.dto.web.novel.writer;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.ppnovel.common.entity.BaseEntity;

import java.util.List;

@Data
public class CreateNovel extends BaseEntity {
    @NotNull
    private String title;

    private Integer target; // 男频， 女频

    private List<Integer> categoryIds; // 主分类

    private List<Integer> themeIds; // 主题

    private List<Integer> roleIds; // 角色

    private List<Integer> plotIds; // 情节

    private String cover; // 封面
}
