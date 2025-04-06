package com.ssafy.booknest.domain.search.repository;

import com.ssafy.booknest.domain.search.record.SearchedBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface BookSearchRepository extends ElasticsearchRepository<SearchedBook, String> {
    Page<SearchedBook> findByTitleContainingOrAuthorsContaining(String title, String authors, Pageable pageable);

    Page<SearchedBook> findByTagsIn(List<String> tags, Pageable pageable);

    Page<SearchedBook> findByTagsInAndTitleContainingOrAuthorsContaining(List<String> tags, String title, String authors, Pageable pageable);
}