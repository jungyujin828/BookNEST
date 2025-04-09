package com.ssafy.booknest.domain.user.entity.tag;

import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_tag_recommendation")
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class UserTagRecommendation extends BaseEntity {

    private String tag;

    @ManyToOne
    private User user;

    @ManyToOne
    private Book book;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
