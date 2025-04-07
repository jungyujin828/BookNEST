package com.ssafy.booknest.domain.user.repository;

import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.UserCategoryAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCategoryAnalysisRepository extends JpaRepository<UserCategoryAnalysis, Integer> {

    Optional<UserCategoryAnalysis> findByUser(User user);

    Optional<UserCategoryAnalysis> findByUserId(Integer userId);
}
