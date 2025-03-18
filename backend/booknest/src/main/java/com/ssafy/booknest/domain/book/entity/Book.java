package com.ssafy.booknest.domain.book.entity;

import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


import java.time.LocalDate;
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

    @Column(columnDefinition = "TEXT")
    private String intro;

    @Column(name= "`index`", columnDefinition = "TEXT")
    private String index;

    @Column(columnDefinition = "TEXT")
    private String publisherReview;

    @OneToMany(mappedBy = "book" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookCategory> bookCategories;

    @OneToMany(mappedBy = "book" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookAuthor> bookAuthors;

    @OneToMany(mappedBy = "book" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookTag> bookTags;

    @OneToMany(mappedBy = "book" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BestSeller> bestSellers;

    @OneToMany(mappedBy = "book" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Nest> nests;

    @OneToMany(mappedBy = "book" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings;

    @OneToMany(mappedBy = "book" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

}
