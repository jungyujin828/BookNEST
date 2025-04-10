package com.ssafy.booknest.domain.user.repository;

import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.UserAuthorAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface UserAuthorAnalysisRepository extends JpaRepository<UserAuthorAnalysis, Integer> {

    @Query("SELECT u.favoriteAuthor FROM UserAuthorAnalysis u WHERE u.userId= :userId")
    List<String> findAuthorNamesByUserId(@Param("userId") Integer userId);

    List<UserAuthorAnalysis> findByUserId(Integer targetUserId);

    void deleteByUserId(Integer userId);
}
