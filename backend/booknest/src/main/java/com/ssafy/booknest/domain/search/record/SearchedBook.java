package com.ssafy.booknest.domain.search.record;

import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Builder
@Document(indexName = "book")
public record SearchedBook(

        @Id
        String bookId,

        @Field(type = FieldType.Keyword)
        String title,

        @Field(type = FieldType.Keyword, name = "image_url")
        String imageURL,

        @Field(type = FieldType.Text)
        String authors
) {

    public static SearchedBook fromAnotherSource(final SearchedBook book) {
        return SearchedBook.builder()
                .bookId(book.bookId())
                .title(book.title())
                .imageURL(book.imageURL())
                .authors(book.authors())
                .build();
    }
}
