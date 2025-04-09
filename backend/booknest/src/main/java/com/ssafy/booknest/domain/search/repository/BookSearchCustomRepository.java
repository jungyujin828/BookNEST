package com.ssafy.booknest.domain.search.repository;

import com.ssafy.booknest.domain.search.record.BookEval;
import com.ssafy.booknest.domain.search.record.SearchedBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookSearchCustomRepository {

    void save(SearchedBook book);
    void saveBookEval(BookEval book);
    Page<SearchedBook> searchByTagsAndKeyword(List<String> tags, String keyword, Pageable pageable);

    List<String> autocompleteTitle(String keyword);
}
