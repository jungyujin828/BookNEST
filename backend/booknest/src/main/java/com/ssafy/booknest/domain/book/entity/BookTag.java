package com.ssafy.booknest.domain.book.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "book_tag")
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class BookTag {

    @Id
    @Column(name ="id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name="book")
    private Book book;

    @ManyToOne
    @JoinColumn(name="tag")
    private Tag tag;
}
