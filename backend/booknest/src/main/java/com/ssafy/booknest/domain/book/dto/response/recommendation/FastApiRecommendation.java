package com.ssafy.booknest.domain.book.dto.response.recommendation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FastApiRecommendation {

    @JsonProperty("book_id")
    private Integer bookId;
    @JsonProperty("image_url")
    private String imageUrl;
    @JsonProperty("published_date")
    private String publishedDate;
    @JsonProperty("index_content")
    private String indexContent;
    @JsonProperty("publisher_review")
    private String publisherReview;
    private String title;
    private String isbn;
    private String publisher;
    private String pages;
    private String intro;
    private String authors;
    private String categories;
    private String tags;

}
