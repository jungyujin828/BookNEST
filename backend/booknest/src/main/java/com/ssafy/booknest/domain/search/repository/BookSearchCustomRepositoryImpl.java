package com.ssafy.booknest.domain.search.repository;

import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.JsonData;
import com.ssafy.booknest.domain.search.record.SearchedBook;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.*;

@Repository
@RequiredArgsConstructor
public class BookSearchCustomRepositoryImpl implements BookSearchCustomRepository {

    private final ElasticsearchClient elasticsearchClient;

    @Override
    public List<String> autocompleteTitle(String keyword) {
        try {
            SearchResponse<Void> response = elasticsearchClient.search(s -> s
                            .index("book")
                            .size(10)
                            .query(q -> q
                                    .bool(b -> b
                                            .should(s1 -> s1.match(m -> m.field("title.autocomplete").query(keyword)))
                                            .should(s2 -> s2.match(m -> m.field("authors.autocomplete").query(keyword)))
                                    )
                            )
                            .fields(
                                    FieldAndFormat.of(f -> f.field("title")),
                                    FieldAndFormat.of(f -> f.field("authors"))
                            ),
                    Void.class
            );

            Set<String> suggestions = new LinkedHashSet<>();
            for (Hit<Void> hit : response.hits().hits()) {
                Map<String, JsonData> fields = hit.fields();

                if (fields.containsKey("title")) {
                    Object titleObj = fields.get("title").to(Object.class);
                    if (titleObj instanceof List<?>) {
                        ((List<?>) titleObj).forEach(t -> suggestions.add(t.toString()));
                    } else {
                        suggestions.add(titleObj.toString());
                    }
                }

                if (fields.containsKey("authors")) {
                    Object authorObj = fields.get("authors").to(Object.class);
                    if (authorObj instanceof List<?>) {
                        ((List<?>) authorObj).forEach(a -> suggestions.add(a.toString()));
                    } else {
                        suggestions.add(authorObj.toString());
                    }
                }
            }

            return new ArrayList<>(suggestions);

        } catch (IOException e) {
            throw new CustomException(ErrorCode.ELASTICSEARCH_ERROR);
        }
    }

    @Override
    public void save(SearchedBook book) {
        try {
            elasticsearchClient.index(i -> i
                    .index("book")
                    .id(book.getBookId().toString())
                    .document(book)
            );
        } catch (IOException e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Page<SearchedBook> searchByTagsAndKeyword(List<String> tags, String keyword, Pageable pageable) {
        try {
            boolean hasTags = tags != null && !tags.isEmpty();
            boolean hasKeyword = keyword != null && !keyword.isBlank();

            // 키워드만 있는 경우
            if (!hasTags && hasKeyword) {
                Query keywordQuery = Query.of(q -> q.bool(b -> b
                        .should(s -> s.match(m -> m.field("title").query(keyword)))
                        .should(s -> s.match(m -> m.field("authors").query(keyword)))
                        .should(s -> s.matchPhrase(mp -> mp.field("title").query(keyword)))
                        .should(s -> s.matchPhrase(mp -> mp.field("authors").query(keyword)))
                ));

                SearchRequest request = SearchRequest.of(s -> s
                        .index("book")
                        .query(keywordQuery)
                        .from((int) pageable.getOffset())
                        .size(pageable.getPageSize())
                );

                SearchResponse<SearchedBook> response = elasticsearchClient.search(request, SearchedBook.class);

                List<SearchedBook> content = response.hits().hits().stream()
                        .map(Hit::source)
                        .toList();

                long total = response.hits().total() != null ? response.hits().total().value() : content.size();

                return new PageImpl<>(content, pageable, total);
            }

            // 태그만 있는 경우 또는 태그 + 키워드 둘 다 있는 경우
            List<Query> mustQueries = new ArrayList<>();

            if (hasTags) {
                for (String tag : tags) {
                    mustQueries.add(Query.of(q ->
                            q.term(t -> t.field("tags").value(tag))
                    ));
                }
            }

            if (hasKeyword) {
                Query keywordQuery = Query.of(q -> q.bool(b -> b
                        .should(s -> s.match(m -> m.field("title").query(keyword)))
                        .should(s -> s.match(m -> m.field("authors").query(keyword)))
                        .should(s -> s.matchPhrase(mp -> mp.field("title").query(keyword)))
                        .should(s -> s.matchPhrase(mp -> mp.field("authors").query(keyword)))
                ));
                mustQueries.add(keywordQuery);
            }

            Query finalQuery = Query.of(q -> q.bool(b -> b.must(mustQueries)));

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
