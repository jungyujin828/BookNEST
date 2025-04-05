package com.ssafy.booknest.domain.book.dto.response;

import com.ssafy.booknest.domain.book.entity.Rating;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyRatingResponse {

    private Integer bookId;
    private Double rating;

    public static MyRatingResponse of(Rating rating, Integer bookId) {
        if (rating == null || rating.getBook() == null) {
            return MyRatingResponse.builder()
                    .bookId(bookId)
                    .rating(0.0)
                    .build();
        }
        return MyRatingResponse.builder()
                .bookId(rating.getBook().getId())
                .rating(rating.getRating())
                .build();
    }
}

