package com.ssafy.booknest.domain.book.dto.response;

import com.ssafy.booknest.domain.book.dto.response.ReviewResponse;
import com.ssafy.booknest.domain.book.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDetailResponse {

    private int bookId;
    private Double avgRating;
    private String title;
    private LocalDate publishedDate;
    private String isbn;
    private String publisher;
    private int pages;
    private String imageUrl;
    private String intro;
    private String index;
    private String publisherReview;

    private List<String> authors;
    private List<String> tags;
    private List<String> categories;

    private List<ReviewResponse> reviews;

    public static BookDetailResponse of(Book book, Double avgRating) {
        return BookDetailResponse.builder()
                .bookId(book.getId())
                .avgRating(avgRating)
                .title(book.getTitle())
                .publishedDate(book.getPublishedDate())
                .isbn(book.getIsbn())
                .publisher(book.getPublisher())
                .pages(book.getPages())
                .imageUrl(book.getImageUrl())
                .intro(book.getIntro())
                .index(book.getIndex())
                .publisherReview(book.getPublisherReview())
                .authors(book.getBookAuthors().stream()
                        .map(bookAuthor -> bookAuthor.getAuthor().getName())
                        .collect(Collectors.toList()))
                .tags(book.getBookTags().stream()
                        .map(bookTag -> bookTag.getTag().getName())
                        .collect(Collectors.toList()))
                .categories(book.getBookCategories().stream()
                        .map(bookCategory -> bookCategory.getCategory().getName())
                        .collect(Collectors.toList()))
                .reviews(book.getReviews().stream()
                        .map(ReviewResponse::of)
                        .collect(Collectors.toList()))
                .build();
    }
}
