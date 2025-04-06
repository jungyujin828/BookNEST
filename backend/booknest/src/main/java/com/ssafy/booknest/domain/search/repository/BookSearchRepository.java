package com.ssafy.booknest.domain.search.repository;

import com.ssafy.booknest.domain.search.record.SearchedBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface BookSearchRepository extends ElasticsearchRepository<SearchedBook, String> {
    Page<SearchedBook> findByTitleContainingOrAuthorsContaining(String title, String authors, Pageable pageable);

    @Query("""
    {
      "terms": {
        "tags": ?0
      }
    }
    """)
    Page<SearchedBook> findByExactTags(List<String> tags, Pageable pageable);

    @Query("""
    {
      "bool": {
        "must": [
          { "terms": { "tags": ?0 } },
          { "match": { "title": ?1 } },
          { "match": { "authors": ?1 } }
        ]
      }
    }
    """)
    Page<SearchedBook> findByTagsAndKeyword(List<String> tags, String keyword, Pageable pageable);

}