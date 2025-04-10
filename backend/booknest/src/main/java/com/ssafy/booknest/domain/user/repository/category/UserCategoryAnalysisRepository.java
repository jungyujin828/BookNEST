package com.ssafy.booknest.domain.user.repository.category;

import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.category.UserCategoryAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCategoryAnalysisRepository extends JpaRepository<UserCategoryAnalysis, Integer> {

    void deleteByUserId(Integer userId);

    @Query("SELECT u.favoriteCategory FROM UserCategoryAnalysis u WHERE u.userId = :userId")
    List<String> findTopCategoryNamesByUserId(@Param("userId") Integer userId);

}
