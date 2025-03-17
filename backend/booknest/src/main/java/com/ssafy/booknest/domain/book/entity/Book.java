package com.ssafy.booknest.domain.book.entity;

import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


import java.time.LocalDate;
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
    private LocalDate publishedDate;

    @Column(name="isbn", nullable = false, length = 20)
    private String isbn;

    @Column(name="publisher", nullable= false, length = 100)
    private String publisher;

    @Column(name="pages", nullable = false)
    private Integer pages;

    @Column(name="image_url", nullable = false)
    private String imageUrl;

    @Column(name="intro", nullable = true)
    @Lob
    private String intro;

    @Column(name="index", nullable = true)
    @Lob
    private String index;

    @Column(name="publisher_review", nullable = true)
    @Lob
    private String publisherReview;

    @OneToMany(mappedBy = "book")
    private List<BookCategory> bookCategories = new ArrayList<>();

    @OneToMany(mappedBy = "book")
    private List<BookAuthor> bookAuthors = new ArrayList<>();

    @OneToMany(mappedBy = "book")
    private List<BookTag> bookTags = new ArrayList<>();

    @OneToMany(mappedBy = "book")
    private List<BestSeller> bestSellers = new ArrayList<>();

    @OneToMany(mappedBy = "book")
    private List<Nest> nests = new ArrayList<>();

}
