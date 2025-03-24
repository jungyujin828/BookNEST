package com.ssafy.booknest.domain.user.repository;

import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.enums.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByProviderAndProviderId(Provider provider, String providerId);

    Optional<User> findById(Integer id);

    // 닉네임 중복확인
    boolean existsByNickname(String nickname);

}
