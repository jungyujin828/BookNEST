package com.ssafy.booknest.domain.search.repository;

import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.ssafy.booknest.domain.search.record.SearchedBook;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class BookSearchCustomRepositoryImpl implements BookSearchCustomRepository {

    private final ElasticsearchClient elasticsearchClient;

    @Override
    public Page<SearchedBook> searchByTagsAndKeyword(List<String> tags, String keyword, Pageable pageable) {
        try {
            List<Query> mustQueries = new ArrayList<>();

            // AND 조건: 태그마다 term 쿼리
            for (String tag : tags) {
                mustQueries.add(Query.of(q -> q.term(t -> t.field("tags.keyword").value(tag))));
            }

            // 키워드가 있을 경우 title, authors에 대해 match 쿼리 (OR 조건)
            if (keyword != null && !keyword.isBlank()) {
                Query keywordQuery = Query.of(q -> q.bool(b -> b
                        .should(s -> s.match(m -> m.field("title").query(keyword)))
                        .should(s -> s.match(m -> m.field("authors").query(keyword)))
                ));
                mustQueries.add(keywordQuery);
            }

            // 전체 bool 쿼리 조립
            Query finalQuery = Query.of(q -> q.bool(b -> b.must(mustQueries)));

            // 검색 요청 생성
            SearchRequest request = SearchRequest.of(s -> s
                    .index("book")
                    .query(finalQuery)
                    .from((int) pageable.getOffset())
                    .size(pageable.getPageSize())
            );

            SearchResponse<SearchedBook> response = elasticsearchClient.search(request, SearchedBook.class);

            List<SearchedBook> content = response.hits().hits().stream()
                    .map(Hit::source)
                    .toList();

            long total = response.hits().total() != null ? response.hits().total().value() : content.size();

            return new PageImpl<>(content, pageable, total);
        } catch (IOException e) {
            throw new RuntimeException("비상비상: ", e);
        }
    }
}
