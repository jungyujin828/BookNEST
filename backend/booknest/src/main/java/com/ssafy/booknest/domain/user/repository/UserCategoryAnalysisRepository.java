package com.ssafy.booknest.domain.user.repository;

import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.UserCategoryAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCategoryAnalysisRepository extends JpaRepository<UserCategoryAnalysis, Integer> {

    Optional<UserCategoryAnalysis> findByUser(User user);

    Optional<UserCategoryAnalysis> findByUserId(Integer userId);

    void deleteByUser(User user);

    @Query("SELECT u.favoriteCategory FROM UserCategoryAnalysis u WHERE u.user.id = :userId")
    List<String> findTopCategoryNamesByUserId(@Param("userId") Integer userId);
}
