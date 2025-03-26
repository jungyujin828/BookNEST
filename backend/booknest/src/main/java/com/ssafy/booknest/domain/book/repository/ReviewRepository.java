package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository  extends JpaRepository<Review, Long> {

    Optional<Review> findByUserIdAndBookId(Integer userId, Integer bookId);
}