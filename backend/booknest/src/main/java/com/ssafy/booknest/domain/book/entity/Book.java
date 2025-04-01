package com.ssafy.booknest.domain.book.entity;

import com.ssafy.booknest.domain.nest.entity.BookMark;
import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "book")
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Book extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "published_date", nullable = false)
    private String publishedDate;

    @Column(name="isbn", length = 20)
    private String isbn;

    @Column(name="publisher", nullable= false, length = 100)
    private String publisher;

    @Column(name="pages", nullable = false)
    private Integer pages;

    @Column(name="image_url")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String intro;

    @Column(name="book_index", columnDefinition = "TEXT")
    private String bookIndex;

    @Column(columnDefinition = "TEXT")
    private String publisherReview;

    @Builder.Default
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<BookCategory> bookCategories = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<BookAuthor> bookAuthors = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<BookTag> bookTags = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<BestSeller> bestSellers = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<BookMark> BookMarks = new ArrayList<>();

    public String getAuthors() {
        return bookAuthors.stream()
                .map(bookAuthor -> bookAuthor.getAuthor().getName()) // 저자 이름 가져오기
                .collect(Collectors.joining(", ")); // 쉼표(,)로 구분하여 문자열로 변환
    }

}
