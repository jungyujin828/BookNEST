package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    Optional<Rating> getRatingByUserIdAndBookId(Integer userId, Integer bookId);
}
