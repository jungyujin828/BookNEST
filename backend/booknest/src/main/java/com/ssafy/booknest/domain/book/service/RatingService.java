package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.request.RatingRequest;
import com.ssafy.booknest.domain.book.dto.response.MyRatingResponse;
import com.ssafy.booknest.domain.book.dto.response.UserRatingResponse;
import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.entity.IgnoredBook;
import com.ssafy.booknest.domain.book.entity.Rating;
import com.ssafy.booknest.domain.book.entity.Review;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.IgnoredBookRepository;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.nest.repository.BookNestRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final RatingRepository ratingRepository;
    private final IgnoredBookRepository ignoredBookRepository;
    private final BookNestRepository bookNestRepository;

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

        if (!rating.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        Optional<Review> review = reviewRepository.findByUserIdAndBookId(userId, bookId);

        // 평점 수정
        rating.updateRating(dto.getScore());

        // 만약에 이미 Review 테이블에 평점 있으면 이것도 수정
        if (review.isPresent() && review.get().getRating() != null) {
            review.get().updateRating(dto.getScore());
        }
    }

    // 평점 삭제
    @Transactional
    public void deleteRating(Integer userId, Integer bookId) {
        // 평점이 존재하지 않으면 예외 발생
        Rating rating = ratingRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.RATING_NOT_FOUND));

        // 평점 작성자와 현재 사용자 불일치 시 접근 금지
        if (!rating.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        // 사용자의 둥지에 포함된 도서는 평점 삭제 불가
        if (bookNestRepository.existByBookId(userId, bookId)) {
            throw new CustomException(ErrorCode.CANNOT_DELETE_RATING_IN_NEST);
        }

        // 관련 리뷰가 존재하고, 평점이 설정되어 있다면 평점만 제거
        Optional<Review> review = reviewRepository.findByUserIdAndBookId(userId, bookId);
        if (review.isPresent() && review.get().getRating() != null) {
            review.get().updateRating(null);
        }

        // 평점 삭제
        ratingRepository.delete(rating);
    }


    // 사용자 평점 목록 조회
    @Transactional(readOnly = true)
    public CustomPage<UserRatingResponse> getRatingList(Integer userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Page<Rating> ratingPage = ratingRepository.findByUserIdOrderByUpdatedAtDesc(userId, pageable);

        Page<UserRatingResponse> responsePage = ratingPage.map(UserRatingResponse::of);

        return new CustomPage<>(responsePage);
    }


    // 사용자의 해당 책에 대한 평점 가져오기
    public MyRatingResponse getUserRating(Integer userId, Integer bookId) {
        Rating rating = ratingRepository.findByUserIdAndBookId(userId, bookId)
                .orElse(null);
        return MyRatingResponse.of(rating);
    }

    // 도서 관심없음
    @Transactional
    public void ignoreBook(Integer userId, Integer bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        // 이미 관심없음 처리된 경우 예외 발생
        if (ignoredBookRepository.existsByUserAndBook(user, book)) {
            throw new CustomException(ErrorCode.ALREADY_IGNORED_BOOK);
        }

        IgnoredBook ignoredBook = IgnoredBook.builder()
                .user(user)
                .book(book)
                .build();

        ignoredBookRepository.save(ignoredBook);
    }
}
