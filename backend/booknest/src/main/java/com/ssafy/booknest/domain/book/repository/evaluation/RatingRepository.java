package com.ssafy.booknest.domain.book.repository.evaluation;

import com.ssafy.booknest.domain.book.entity.evaluation.Rating;

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

    // 특정 유저의 해당 책에 대한 평점 조회
    Optional<Rating> getRatingByUserIdAndBookId(Integer userId, Integer bookId);


    boolean existsByUserIdAndBookId(Integer userId, Integer bookId);

    // 가장 최근 수정된 순으로 평점 목록 가져오기
    Page<Rating> findByUserIdOrderByUpdatedAtDesc(Integer userId, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.user.id = :userId")
    Integer countRatings(@Param("userId") Integer userId);

    @Query("SELECT r.book.id FROM Rating r WHERE r.user.id = :userId")
    List<Integer> findBookIdsByUserId(@Param("userId") Integer userId);

    // 회원 별 각 카테고리별 평균점수 중에 가장 높은 거로 배치 작업
    @Query("SELECT r FROM Rating r " +
            "JOIN FETCH r.book b " +
            "JOIN FETCH b.bookCategories bc " +
            "JOIN FETCH bc.category " +
            "JOIN FETCH r.user")
    List<Rating> findAllWithBookAndCategory();

    // 회원 별 각 태그별 평균점수 중에 가장 높은 거로 배치 작업
    @Query("SELECT r FROM Rating r " +
            "JOIN FETCH r.book b " +
            "JOIN FETCH b.bookTags bt " +
            "JOIN FETCH bt.tag")
    List<Rating> findAllWithBookAndTags();

    // 회원 별 각 작가별 평균점수 중에 가장 높은 거로 배치 작업
    @Query("SELECT r FROM Rating r " +
            "JOIN FETCH r.book b " +
            "JOIN FETCH b.bookAuthors ba " +
            "JOIN FETCH ba.author")
    List<Rating> findAllWithBookAndAuthor();



}
