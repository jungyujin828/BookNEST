package com.ssafy.booknest.domain.book.dto.response;

import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.entity.BookAuthor;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {

    private int bookId;
    private String title;
    private String publishedDate;
    private String imageUrl;
    private List<String> authors;

    public static BookResponse of(Book book) {
        return BookResponse.builder()
                .bookId(book.getId())
                .title(book.getTitle())
                .imageUrl(book.getImageUrl())
                .publishedDate(book.getPublishedDate())
                .authors(book.getBookAuthors().stream()
                        .map(bookAuthor -> bookAuthor.getAuthor().getName())
                        .collect(Collectors.toList()))
                .build();
    }
}
