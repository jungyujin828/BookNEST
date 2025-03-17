package com.ssafy.booknest.domain.nest.entity;

import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "nest")
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Nest extends BaseEntity {

    @Column(name = "is_liked", nullable = false)
    private Boolean isLiked;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @OneToOne(mappedBy = "nest", fetch = FetchType.LAZY)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

}