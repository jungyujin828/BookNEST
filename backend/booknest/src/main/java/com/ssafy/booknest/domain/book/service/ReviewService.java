package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.request.ReviewRequest;
import com.ssafy.booknest.domain.book.dto.response.BestReviewResponse;
import com.ssafy.booknest.domain.book.dto.response.UserReviewResponse;
import com.ssafy.booknest.domain.book.entity.*;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.book.repository.ReviewLikeRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final RatingRepository ratingRepository;
    private final ReviewLikeRepository reviewLikeRepository;

    // 한줄평 등록
    @Transactional
    public void saveReview(Integer userId, Integer bookId, ReviewRequest dto) {
        // 입력값 검증 (Fail-Fast)
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new CustomException(ErrorCode.EMPTY_REVIEW_CONTENT);
        }

        // 중복 체크
        if (reviewRepository.existsByUserIdAndBookId(userId, bookId)) {
            throw new CustomException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        // 필수 객체 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        // 평점이 있으면 포함해서 빌더에 설정
        Optional<Rating> ratingOptional = ratingRepository.findByUserIdAndBookId(userId, bookId);

        Review review = Review.builder()
                .user(user)
                .book(book)
                .content(dto.getContent())
                .rating(ratingOptional.map(Rating::getRating).orElse(null))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        reviewRepository.save(review);
    }



    // 한줄평 수정
    @Transactional
    public void updateReview(Integer userId, Integer reviewId, ReviewRequest dto) {
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new CustomException(ErrorCode.EMPTY_REVIEW_CONTENT);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        review.updateContent(dto.getContent());

    }

    // 한줄평 삭제
    @Transactional
    public void deleteReview(Integer userId, Integer reviewId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        // 현재 사용자와 작성자가 다르면 접근 금지
        if (!review.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        reviewRepository.delete(review);
    }


    // 사용자 한줄평 목록
    @Transactional(readOnly = true)
    public CustomPage<UserReviewResponse> getReviews(Integer userId, Pageable pageable) {
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        Page<Review> reviewPage = reviewRepository.findByUserIdOrderByUpdatedAtDesc(userId, pageable);

        Page<UserReviewResponse> responsePage = reviewPage.map(UserReviewResponse::of);

        return new CustomPage<>(responsePage);
    }

    // 한줄평 좋아요
    @Transactional
    public void likeReview(Integer userId, Integer reviewId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (reviewLikeRepository.existsByUserAndReview(user, review)) {
            throw new CustomException(ErrorCode.REVIEW_ALREADY_LIKED);
        }

        reviewLikeRepository.save(
                ReviewLike.builder()
                        .user(user)
                        .review(review)
                        .build()
        );
        review.incrementLikes();
    }

    // 한줄평 좋아요 취소
    @Transactional
    public void unlikeReview(Integer userId, Integer reviewId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        ReviewLike reviewLike = reviewLikeRepository.findByUserAndReview(user, review)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_LIKE_NOT_FOUND));

        reviewLikeRepository.delete(reviewLike);
        review.decrementLikes();
    }

    // 오늘의 베스트
    @Transactional(readOnly = true)
    public List<BestReviewResponse> getBestReviews(Integer userId) {
        // 유저 존재 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 오늘 날짜 기준 범위 설정
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = startOfToday.plusDays(1);

        // 오늘 좋아요 받은 리뷰들 중 Top 3 조회
        Pageable topThree = PageRequest.of(0, 3);
        List<Object[]> reviewIdAndLikeCountList = reviewLikeRepository.findTop3ReviewIdsLikedToday(startOfToday, endOfToday, topThree);


        // 리뷰 ID 추출
        List<Integer> reviewIds = reviewIdAndLikeCountList.stream()
                .map(row -> (Integer) row[0])
                .toList();

        // 리뷰 상세 조회
        List<Review> reviews = reviewRepository.findAllById(reviewIds);

        // 좋아요 수 매핑
        Map<Integer, Integer> reviewLikeCountMap = reviewIdAndLikeCountList.stream()
                .collect(Collectors.toMap(
                        row -> (Integer) row[0],
                        row -> ((Long) row[1]).intValue()
                ));

        // 응답 리스트 생성
        List<BestReviewResponse> resultList = new ArrayList<>();
        for (int i = 0; i < reviews.size(); i++) {
            Review review = reviews.get(i);
            int todayLikes = reviewLikeCountMap.getOrDefault(review.getId(), 0);
            BestReviewResponse response = BestReviewResponse.of(review, userId, todayLikes, i + 1);
            resultList.add(response);
        }


        return resultList;
    }

}
