package com.ssafy.booknest.domain.book.dto.response.evaluation;

import com.ssafy.booknest.domain.book.entity.evaluation.Review;
import com.ssafy.booknest.domain.user.entity.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
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
        User reviewer = review.getUser();

        String reviewerName = (reviewer.getDeletedAt() == null) ? reviewer.getNickname() : "탈퇴한 유저";

        boolean myLiked = review.getReviewLikes().stream()
                .anyMatch(like -> like.getUser().getId().equals(currentUserId));

        return ReviewResponse.builder()
                .reviewId(review.getId())
                .rating(review.getRating())
                .reviewerName(reviewerName)
                .content(review.getContent())
                .myLiked(myLiked)
                .likes(review.getLikes())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }

}
