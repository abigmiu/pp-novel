package org.ppnovel.web.controller.search;

import java.io.IOException;
import java.util.List;

import org.ppnovel.common.es.ChapterESDoc;
import org.ppnovel.web.service.search.SearchService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("search")
@Tag(name = "搜索")
public class SearchController {
    private final SearchService searchService;

    public SearchController(
        SearchService searchService
    ) {
        this.searchService = searchService;
    }

    @GetMapping("chapter")
    @Operation(summary = "根据id查 chapter es 数据")
    public ChapterESDoc searchByChapterId(@RequestParam("chapterId") Integer chapterId) throws IOException {
        return searchService.findChapterESDocById(chapterId);
    }

    @GetMapping("chapter-keyword")
    public List<ChapterESDoc> searchChapterKeyword(@RequestParam("key") String key) throws IOException {
        return searchService.searchChapterKeyword(key);
    }
    
    
}
