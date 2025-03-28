package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    Optional<Review> findByUserIdAndBookId(Integer userId, Integer bookId);


    boolean existsByUserIdAndBookId(Integer userId, Integer bookId);


    boolean existsByUserIdAndBookIdAndRatingIsNotNull(Integer userId, Integer bookId);

    List<Review> findByUserId(Integer userId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.user.id = :userId")
    Integer countReviews(@Param("userId") Integer userId);

}