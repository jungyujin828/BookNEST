package com.ssafy.booknest.domain.search.repository;

import com.ssafy.booknest.domain.search.record.SearchedBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface BookSearchRepository extends ElasticsearchRepository<SearchedBook, String> {
    Page<SearchedBook> findByTitleContaining(String title, Pageable pageable);
}