package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.request.ReviewRequest;
import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.dto.response.ReviewResponse;
import com.ssafy.booknest.domain.book.dto.response.UserReviewResponse;
import com.ssafy.booknest.domain.book.entity.*;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.book.repository.ReviewLikeRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
        // 1. 입력값 검증 (Fail-Fast)
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new CustomException(ErrorCode.EMPTY_REVIEW_CONTENT);
        }

        // 2. 중복 체크
        if (reviewRepository.existsByUserIdAndBookId(userId, bookId)) {
            throw new CustomException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        // 3. 필수 객체 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        // 4. 평점이 있으면 포함해서 빌더에 설정
        Optional<Rating> ratingOptional = ratingRepository.findByUserIdAndBookId(userId, bookId);

        Review review = Review.builder()
                .user(user)
                .book(book)
                .content(dto.getContent())
                .rating(ratingOptional.map(Rating::getRating).orElse(null)) // 평점이 없으면 null
                .createdAt(LocalDateTime.now())
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


        review.updateContent(dto.getContent());
    }

    // 한줄평 삭제
    @Transactional
    public void deleteReview(Integer userId, Integer reviewId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        reviewRepository.delete(review);
    }


    // 사용자 한줄평 목록
    @Transactional(readOnly = true)
    public List<UserReviewResponse> getReviews(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        List<Review> reviewList = reviewRepository.findByUserId(userId);

        return reviewList.stream()
                .map(review -> UserReviewResponse.of(review))
                .toList();
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

}
