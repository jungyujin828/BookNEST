package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.request.RatingRequest;
import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.entity.Rating;
import com.ssafy.booknest.domain.book.entity.Review;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final RatingRepository ratingRepository;

    // 평점 등록
    @Transactional
    public void createBookRating(Integer userId, Integer bookId, RatingRequest dto) {
        // 입력값 검증 (Fail-Fast)
        if (dto.getScore() == null) {
            throw new CustomException(ErrorCode.EMPTY_RATING_CONTENT);
        }

        // 평점 등록인데 이미 점수가 저장 되어 있으면 등록 불가
        if (ratingRepository.existsByUserIdAndBookId(userId, bookId) || reviewRepository.existsByUserIdAndBookIdAndRatingIsNotNull(userId, bookId)) {
            throw new CustomException(ErrorCode.RATING_ALREADY_EXISTS);
        }

        // 필수 객체 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        Rating rating = Rating.builder()
                .user(user)
                .book(book)
                .rating(dto.getScore())// 평점이 없으면 null
                .createdAt(LocalDateTime.now())
                .build();

        ratingRepository.save(rating);

        Optional<Review> review = reviewRepository.findByUserIdAndBookId(userId, bookId);

        if(reviewRepository.existsByUserIdAndBookId(userId, bookId)) {
            review.get().updateRating(dto.getScore());
        }
    }

    // 평점 수정
    @Transactional
    public void updateRating(Integer userId, Integer bookId, RatingRequest dto) {
        if (dto.getScore() == null) {
            throw new CustomException(ErrorCode.EMPTY_RATING_CONTENT);
        }

        Rating rating = ratingRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.RATING_NOT_FOUND));

        Optional<Review> review = reviewRepository.findByUserIdAndBookId(userId, bookId);

        // 평점 수정
        rating.updateRating(dto.getScore());

        // 만약에 이미 Review 테이블에 평점 있으면 이것도 수정
        if(review.isPresent()) {
            review.get().updateRating(dto.getScore());
        }
    }

    // 평점 삭제
    @Transactional
    public void deleteRating(Integer userId, Integer bookId) {
        Rating rating = ratingRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.RATING_NOT_FOUND));

        if (!rating.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        Optional<Review> review = reviewRepository.findByUserIdAndBookId(userId, bookId);

        if (review.isPresent()) {
            review.get().updateRating(null);  // 평점만 null 처리
        }

        ratingRepository.delete(rating);
    }
}
