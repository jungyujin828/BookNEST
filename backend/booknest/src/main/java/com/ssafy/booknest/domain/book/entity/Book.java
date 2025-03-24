package com.ssafy.booknest.domain.book.entity;

import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


import java.util.ArrayList;
import java.util.List;

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

    @Column(name="isbn", nullable = false, length = 20)
    private String isbn;

    @Column(name="publisher", nullable= false, length = 100)
    private String publisher;

    @Column(name="pages", nullable = false)
    private Integer pages;

    @Column(name="image_url", nullable = false)
    private String imageUrl;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String intro;

    @Column(name="book_index", columnDefinition = "TEXT", nullable = false)
    private String bookIndex;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String publisherReview;

    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookCategory> bookCategories = new ArrayList<>();

    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookAuthor> bookAuthors = new ArrayList<>();

    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookTag> bookTags = new ArrayList<>();

    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BestSeller> bestSellers = new ArrayList<>();

    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

}
