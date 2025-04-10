package com.ssafy.booknest.domain.book.dto.response.recommendation;

import com.ssafy.booknest.domain.book.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteCategoryBookResponse {

    private int bookId;
    private String title;
    private String imageUrl;
    private String publishedDate;
    private List<String> authors;
    private List<String>  tags;
    private String category;

    public static FavoriteCategoryBookResponse of(Book book, String category) {
        return FavoriteCategoryBookResponse.builder()
                .bookId(book.getId())
                .title(book.getTitle())
                .imageUrl(book.getImageUrl())
                .publishedDate(book.getPublishedDate())
                .authors(book.getBookAuthors().stream()
                        .map(bookAuthor -> bookAuthor.getAuthor().getName())
                        .toList())
                .tags(book.getBookTags().stream()
                        .map(bookTag -> bookTag.getTag().getName())
                        .toList())
                .category(category)
                .build();
    }

}
