package com.ssafy.booknest.domain.search.record;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Builder
@Document(indexName = "book")
@JsonIgnoreProperties(ignoreUnknown = true)
public record SearchedBook(

        @JsonProperty("book_id")
        @Field(type = FieldType.Integer, name = "book_id")
        Integer bookId,

        @Field(type = FieldType.Text)
        String title,

        @JsonProperty("image_url")
        @Field(type = FieldType.Keyword, name = "image_url")
        String imageURL,

        @Field(type = FieldType.Text)
        List<String> authors,

        @Field(type = FieldType.Keyword)
        List<String> tags
) {

    public static SearchedBook fromAnotherSource(final SearchedBook book) {
        return SearchedBook.builder()
                .bookId(book.bookId())
                .title(book.title())
                .imageURL(book.imageURL())
                .authors(book.authors())
                .tags(book.tags())
                .build();
    }
}
