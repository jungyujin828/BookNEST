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
    private Double rating;
    private String reviewerName;
    private String content;
    private Boolean myLiked;
    private int likes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReviewResponse of(Review review, Integer currentUserId) {
        boolean myLiked = review.getReviewLikes().stream()
                .anyMatch(like -> like.getUser().getId().equals(currentUserId));

        return ReviewResponse.builder()
                .reviewId(review.getId())
                .rating(review.getRating())
                .reviewerName(review.getUser().getNickname())
                .content(review.getContent())
                .myLiked(myLiked)
                .likes(review.getLikes())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }

}
