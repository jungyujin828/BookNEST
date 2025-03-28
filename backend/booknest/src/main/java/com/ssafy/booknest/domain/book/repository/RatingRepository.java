package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {

    Optional<Rating> getRatingByUserIdAndBookId(Integer userId, Integer bookId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.user.id = :userId")
    Integer countRatings(@Param("userId") Integer userId);
}
