package com.ssafy.booknest.domain.search.dto.response;

import com.ssafy.booknest.domain.search.record.SearchedBook;
import lombok.Builder;

import java.util.List;

@Builder
public record BookSearchResponse(
        Integer bookId,
        String title,
        String imageURL,
        String authors,
        List<String> tags
) {
    public static BookSearchResponse of(SearchedBook book) {
        return BookSearchResponse.builder()
                .bookId(book.bookId())
                .title(book.title())
                .imageURL(book.imageURL())
                .authors(book.authors())
                .tags(book.tags())
                .build();
    }
}