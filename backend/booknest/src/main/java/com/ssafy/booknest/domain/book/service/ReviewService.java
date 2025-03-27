package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.request.ReviewRequest;
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
public class ReviewService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final RatingRepository ratingRepository;

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
    public void updateReview(Integer userId, Integer bookId, ReviewRequest dto) {
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new CustomException(ErrorCode.EMPTY_REVIEW_CONTENT);
        }

        Review review = reviewRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        review.updateContent(dto.getContent());

    }

    // 한줄평 삭제
    @Transactional
    public void deleteReview(Integer userId, Integer bookId) {
        Review review = reviewRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        reviewRepository.delete(review);
    }
}
