package com.ssafy.booknest.domain.book.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@Table(name = "best_seller")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class BestSeller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "book_id")
    private Book book;

}
