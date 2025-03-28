package com.ssafy.booknest.domain.nest.service;

import com.ssafy.booknest.domain.book.entity.Rating;
import com.ssafy.booknest.domain.book.entity.Review;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.nest.dto.response.NestBookListResponse;
import com.ssafy.booknest.domain.nest.entity.BookNest;
import com.ssafy.booknest.domain.nest.repository.BookNestRepository;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
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

@Service
@RequiredArgsConstructor
public class NestService {

    private final UserRepository userRepository;
    private final BookNestRepository bookNestRepository;
    private final RatingRepository ratingRepository;
    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    @Transactional
    public CustomPage<NestBookListResponse> getNestBookList(Integer userId, Integer nestId, Integer nestUserId, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Page<BookNest> bookNestList = bookNestRepository.findByNestIdSorted(nestId, pageable);

        Page<NestBookListResponse> responseList = bookNestList.map(bookNest -> {
            Rating userRating = ratingRepository.getRatingByUserIdAndBookId(nestUserId, bookNest.getBook().getId()).orElse(null);
            Review userReview = reviewRepository.findByUserIdAndBookId(nestUserId, bookNest.getBook().getId()).orElse(null);
            return NestBookListResponse.of(bookNest, userRating, userReview);
        });

        return new CustomPage<>(responseList);
    }

//    public AddBookNestResponse addBookNest(Integer userId, AddBookNestRequest request) {
//        User user = userRepository.findById(userId).orElseThrow(() ->
//                new CustomException(ErrorCode.USER_NOT_FOUND));
//
//        Book book = bookRepository.findById(request.getBookId()).orElseThrow(() ->
//                new CustomException(ErrorCode.BOOK_NOT_FOUND));
//
//        if(user.getNest().getId() != request.getNestId()){
//            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
//        }
//
//        // 사용자의 기존 평점 조회
//        Rating userRating = ratingRepository.getRatingByUserIdAndBookId(user.getId(), book.getId()).orElse(null);
//        Double newRating = request.getRating();
//
//        // 입력받은 평점이 없으면 예외 처리
//        if (newRating == null || newRating.isNaN()) {
//            if (userRating == null) {
//                throw new CustomException(ErrorCode.EMPTY_RATING);
//            }
//        }
//        // 새 평점이 존재하는 경우 처리
//        else {
//            if (userRating == null) {
//                // 새로운 평점 추가
//
//            } else if (!userRating.getRating().equals(newRating)) { // 다를 경우
//                // 기존 평점 업데이트
//
//            }
//        }
//
//        // 사용자의 기존 리뷰 조회
//        Review userReview = reviewRepository.findByUserIdAndBookId(user.getId(), book.getId()).orElse(null);
//        String newReview = request.getReview();
//
//        if (newReview != null) {
//            if (userReview == null) {
//                // 새로운 리뷰 추가
//
//            } else if (!userReview.getContent().equals(newReview)) { // 다를 경우
//                // 기존 평점 업데이트
//
//            }
//        }
//
//
//    }
}