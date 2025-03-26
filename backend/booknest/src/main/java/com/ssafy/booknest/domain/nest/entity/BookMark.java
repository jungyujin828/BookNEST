package com.ssafy.booknest.domain.nest.entity;

import com.ssafy.booknest.domain.book.entity.Book;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "book_mark")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class BookMark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 찜 목록을 책과 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    // 찜 목록이 어떤 서재의 책인지 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nest_id")
    private Nest nest;

    // 찜 여부 (추가적인 상태 정보로 사용할 수 있음)
    @Column(name = "is_bookmarked", nullable = false)
    private Boolean isBookmarked;
}
