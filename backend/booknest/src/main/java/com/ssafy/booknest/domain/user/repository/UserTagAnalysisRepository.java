package com.ssafy.booknest.domain.user.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.UserTagAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTagAnalysisRepository extends JpaRepository<UserTagAnalysis, Integer> {

    Optional<UserTagAnalysis> findByUser(User user);

    void deleteByUser(User user);

    // 유저 가장 좋아하는 태그 조회
    @Query("SELECT u.favoriteTag FROM UserTagAnalysis u WHERE u.user.id = :userId")
    List<String> findTopTagsByUserId(@Param("userId") Integer userId);


}
