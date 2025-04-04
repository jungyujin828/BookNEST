package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Rating;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // 가장 최근 수정된 순으로 평점 목록 가져오기
    Page<Rating> findByUserIdOrderByUpdatedAtDesc(Integer userId, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.user.id = :userId")
    Integer countRatings(@Param("userId") Integer userId);

    @Query("SELECT r.book.id FROM Rating r WHERE r.user.id = :userId")
    List<Integer> findBookIdsByUserId(@Param("userId") Integer userId);
}
