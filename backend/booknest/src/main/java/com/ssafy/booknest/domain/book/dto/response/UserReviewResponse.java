package com.ssafy.booknest.domain.book.dto.response;

import com.ssafy.booknest.domain.book.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserReviewResponse {
    private Integer reviewerId;
    private Integer bookId;
    private Integer reviewId;
    private String review;
    private String bookName;
    private List<String> authors;
    private LocalDateTime updatedAt;

    public static UserReviewResponse of(Review review) {
        return UserReviewResponse.builder()
                .reviewerId(review.getUser().getId())
                .bookId(review.getBook().getId())
                .reviewId(review.getId())
                .review(review.getContent())
                .bookName(review.getBook().getTitle())
                .authors(
                        review.getBook().getBookAuthors().stream()
                                .map(bookAuthor -> bookAuthor.getAuthor().getName())
                                .collect(Collectors.toList())
                )
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
