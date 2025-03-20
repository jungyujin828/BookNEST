package com.ssafy.booknest.domain.book.entity;

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
@Table(name = "review")
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Review extends BaseEntity {

    @Column(name ="rating" , nullable = false)
    private Double rating;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name =" likes" , nullable = false)
    private Integer likes = 0;

    @Column(name="updated_at")
    private LocalDate updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id" , nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id" , nullable = false)
    private Book book;

}
