package com.ssafy.booknest.domain.search.dto.response;

import com.ssafy.booknest.domain.search.record.SearchedBook;
import lombok.Builder;

@Builder
public record BookSearchResponse(
        String bookId,
        String title,
        String imageURL,
        String authors
) {
    public static BookSearchResponse of(SearchedBook book) {
        return BookSearchResponse.builder()
                .bookId(book.bookId())
                .title(book.title())
                .imageURL(book.imageURL())
                .authors(book.authors())
                .build();
    }
}