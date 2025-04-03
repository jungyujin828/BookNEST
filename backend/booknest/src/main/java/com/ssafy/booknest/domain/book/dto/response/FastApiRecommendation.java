package com.ssafy.booknest.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FastApiRecommendation {

    private Integer bookId;
    private String imageUrl;
    private String publishedDate;
    private String indexContent;
    private String publisherReview;
    private String title;
    private String isbn;
    private String publisher;
    private Integer pages;
    private String intro;
    private String authors;
    private String categories;
    private String tags;

}
