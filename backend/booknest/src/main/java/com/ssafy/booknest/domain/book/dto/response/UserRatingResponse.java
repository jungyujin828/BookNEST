package com.ssafy.booknest.domain.book.dto.response;

import com.ssafy.booknest.domain.book.entity.Rating;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class   UserRatingResponse {

    private Integer bookId;
    private Integer ratingId;
    private String bookName;
    private String imageUrl;
    private Double rating;
    private List<String> authors;


    public static UserRatingResponse of(Rating rating){
        return UserRatingResponse.builder()
                .bookId(rating.getBook().getId())
                .ratingId(rating.getId())
                .bookName(rating.getBook().getTitle())
                .imageUrl(rating.getBook().getImageUrl())
                .rating(rating.getRating())
                .authors(
                        rating.getBook().getBookAuthors().stream()
                                .map(bookAuthor -> bookAuthor.getAuthor().getName())
                                .collect(Collectors.toList())
                )
                .build();
    }
}
