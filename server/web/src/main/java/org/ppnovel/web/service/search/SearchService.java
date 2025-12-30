package org.ppnovel.web.service.search;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.ppnovel.common.es.ChapterESDoc;
import org.springframework.stereotype.Service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.GetResponse;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;

@Service
public class SearchService {
    private final ElasticsearchClient esClient;

    public SearchService(
            ElasticsearchClient esClient) {
        this.esClient = esClient;
    }

    public ChapterESDoc findChapterESDocById(Integer id) throws IOException {
        GetResponse<ChapterESDoc> doc = esClient.get(
                i -> i.index("chapter")
                        .id(id.toString()),
                ChapterESDoc.class);

        return doc.found() ? doc.source() : null;
    }

    public List<ChapterESDoc> searchChapterKeyword(String key) throws IOException {
        SearchResponse<ChapterESDoc> searchResponse = esClient.search(
                s -> s
                        .index("chapter")
                        .query(q -> q
                                .multiMatch(m -> m
                                        .fields("title", "content")
                                        .query(key))),
                ChapterESDoc.class);

        return searchResponse.hits().hits()
                .stream()
                .map(Hit::source)
                .collect(Collectors.toList());

    }
}
