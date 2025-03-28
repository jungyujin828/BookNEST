package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Rating;

import com.ssafy.booknest.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {

    Optional<Rating> getRatingByUserIdAndBookId(Integer userId, Integer bookId);

    Optional<Rating> findByUserIdAndBookId(Integer userId, Integer bookId);

    boolean existsByUserIdAndBookId(Integer userId, Integer bookId);

    List<Rating> findByUser(User user);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.user.id = :userId")
    Integer countRatings(@Param("userId") Integer userId);
}
