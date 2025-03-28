package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Review;
import com.ssafy.booknest.domain.book.entity.ReviewLike;
import com.ssafy.booknest.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Integer> {
    boolean existsByUserAndReview(User user, Review review);

    Optional<ReviewLike> findByUserAndReview(User user, Review review);
}
