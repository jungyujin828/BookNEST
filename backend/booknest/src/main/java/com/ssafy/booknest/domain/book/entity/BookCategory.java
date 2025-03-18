package com.ssafy.booknest.domain.book.entity;

import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "book_category")
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class BookCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // id 자동 생성
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)  // Lazy loading 적용 (성능 향상 가능)
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)  // Lazy loading 적용
    @JoinColumn(name = "category_id")
    private Category category;

}
