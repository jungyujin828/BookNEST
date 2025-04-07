package com.ssafy.booknest.domain.user.entity;

import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_tag_analysis")
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class UserTagAnalysis extends BaseEntity {

    @Column(name = "favorite_tag")
    private String favoriteTag;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    public void update(String favoriteTag) {
        this.favoriteTag = favoriteTag;
    }
}
