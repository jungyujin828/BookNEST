package com.ssafy.booknest.domain.user.entity;

import com.ssafy.booknest.global.common.Entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "user")
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Address extends BaseEntity {

    @Column(name="road_address", nullable = false)
    private String roadAddress;

    @Column(name="old_address", nullable = false)
    private String oldAddress;

    @Column(name="zipcode", nullable = false, length = 10)
    private String zipcode;

    @Column(name="city", nullable = false, length = 100)
    private String city;

    @Column(name="district", nullable = false, length=100)
    private String district;
}
