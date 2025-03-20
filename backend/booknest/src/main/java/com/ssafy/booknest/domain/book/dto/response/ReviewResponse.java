package com.ssafy.booknest.domain.book.dto.response;

import com.ssafy.booknest.domain.book.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private int reviewId;
    private String reviewerName;
    private String content;
    private int likes;
    private LocalDateTime createdAt;

    public static ReviewResponse of(Review review) {
        return ReviewResponse.builder()
                .reviewId(review.getId())
                .reviewerName(review.getUser().getNickname())
                .content(review.getContent())
                .likes(review.getLikes())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
