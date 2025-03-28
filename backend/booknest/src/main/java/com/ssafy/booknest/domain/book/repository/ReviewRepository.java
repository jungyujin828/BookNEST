package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    Optional<Review> findByUserIdAndBookId(Integer userId, Integer bookId);


    boolean existsByUserIdAndBookId(Integer userId, Integer bookId);


    boolean existsByUserIdAndBookIdAndRatingIsNotNull(Integer userId, Integer bookId);

    List<Review> findByUserId(Integer userId);

    void saveLike(Integer userId, Integer reviewId);
}