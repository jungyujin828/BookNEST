package com.ssafy.booknest.domain.book.dto.response;

import com.ssafy.booknest.domain.book.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FakeResponse {
    private Integer bookId;
    private String imageUrl;
    private String publishedDate;
    private String indexContent;
    private String publisherReview;
    private String title;
    private String isbn;
    private String publisher;
    private String pages;
    private String intro;
    private String authors;
    private String categories;
    private String tags;

    public static FakeResponse of(Book book) {
        return FakeResponse.builder()
                .bookId(book.getId())
                .imageUrl(book.getImageUrl())
                .publishedDate(book.getPublishedDate())
                .indexContent(book.getBookIndex())
                .publisherReview(book.getPublisherReview())
                .title(book.getTitle())
                .isbn(book.getIsbn())
                .publisher(book.getPublisher())
                .pages(book.getPages())
                .intro(book.getIntro())
                .authors(book.getBookAuthors().stream()
                        .map(bookAuthor -> bookAuthor.getAuthor().getName())
                        .collect(Collectors.joining(",")))
                .categories(book.getBookCategories().stream()
                        .map(bookCategory -> bookCategory.getCategory().getName())
                        .collect(Collectors.joining(",")))
                .tags(book.getBookTags().stream()
                        .map(bookTag -> bookTag.getTag().getName())
                        .collect(Collectors.joining(",")))
                .build();
    }
}

