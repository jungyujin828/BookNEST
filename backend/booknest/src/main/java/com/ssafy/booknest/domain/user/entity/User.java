package com.ssafy.booknest.domain.user.entity;

import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.domain.user.enums.Gender;
import com.ssafy.booknest.domain.user.enums.Provider;
import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user")
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@SQLDelete(sql = "UPDATE user SET deleted_at = DATE_ADD(NOW(), INTERVAL 9 HOUR) WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class User extends BaseEntity {

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(length = 10)
    private String birthdate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "nest_id")
    private Nest nest;


}
