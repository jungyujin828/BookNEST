package com.ssafy.booknest.domain.nest.service;

import com.ssafy.booknest.domain.book.dto.request.RatingRequest;
import com.ssafy.booknest.domain.book.dto.request.ReviewRequest;
import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.entity.Rating;
import com.ssafy.booknest.domain.book.entity.Review;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.book.service.RatingService;
import com.ssafy.booknest.domain.book.service.ReviewService;
import com.ssafy.booknest.domain.nest.dto.request.AddBookNestRequest;
import com.ssafy.booknest.domain.nest.dto.request.DeleteBookNestRequest;
import com.ssafy.booknest.domain.nest.dto.response.AddBookNestResponse;
import com.ssafy.booknest.domain.nest.dto.response.BookMarkListResponse;
import com.ssafy.booknest.domain.nest.dto.response.NestBookListResponse;
import com.ssafy.booknest.domain.nest.entity.BookMark;
import com.ssafy.booknest.domain.nest.entity.BookNest;
import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.domain.nest.repository.BookMarkRepository;
import com.ssafy.booknest.domain.nest.repository.BookNestRepository;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.nest.repository.NestRepository;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class NestService {

    private final UserRepository userRepository;
    private final BookNestRepository bookNestRepository;
    private final RatingRepository ratingRepository;
    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final NestRepository nestRepository;
    private final BookMarkRepository bookMarkRepository;
    private final RatingService ratingService;
    private final ReviewService reviewService;



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

    @Transactional
    public AddBookNestResponse addBookNest(Integer userId, AddBookNestRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(request.getBookId()).orElseThrow(() ->
                new CustomException(ErrorCode.BOOK_NOT_FOUND));

        Nest nest = user.getNest();
        if(nest.getId() != request.getNestId()){
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        // 사용자의 기존 평점 조회
        Rating userRating = ratingRepository.getRatingByUserIdAndBookId(user.getId(), book.getId()).orElse(null);
        Double newRating = request.getRating();

        // 입력받은 평점이 없으면 예외 처리
        if (newRating == null || newRating.isNaN()) {
            if (userRating == null) {
                throw new CustomException(ErrorCode.EMPTY_RATING);
            }
        }
        // 새 평점이 존재하는 경우 처리
        else {
            RatingRequest dto = RatingRequest.builder().score(newRating).build();
            if (userRating == null) {
                // 새로운 평점 추가
                ratingService.createBookRating(user.getId(), book.getId(), dto);
            } else if (!userRating.getRating().equals(newRating)) { // 다를 경우
                // 기존 평점 업데이트
                ratingService.updateRating(user.getId(), book.getId(), dto);
            }
        }
        // 사용자의 기존 리뷰 조회
        Review userReview = reviewRepository.findByUserIdAndBookId(user.getId(), book.getId()).orElse(null);
        String newReview = request.getReview();

        if (newReview != null) {
            ReviewRequest dto = ReviewRequest.builder().content(newReview).build();
            if (userReview == null) {
                // 새로운 리뷰 추가
                reviewService.saveReview(user.getId(), book.getId(), dto);
            } else if (!userReview.getContent().equals(newReview)) { // 다를 경우
                // 기존 리뷰 업데이트
                reviewService.updateReview(user.getId(), userReview.getId(), dto);
            }
        }

        // 찜 여부 조회
        BookNest bookNest = bookNestRepository.findByNestIdAndBookId(nest.getId(), book.getId()).orElse(null);
        if (bookNest == null) {
            bookNest = BookNest.builder()
                    .nest(nest)
                    .book(book)
                    .build();
            bookNestRepository.save(bookNest);
        }

        return AddBookNestResponse.builder()
                .nestId(nest.getId())
                .bookId(book.getId())
                .rating(newRating)
                .review(newReview)
                .createdAt(bookNest.getCreatedAt())
                .build();
    }

    @Transactional
    public void deleteBookNest(Integer userId, DeleteBookNestRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(request.getBookId()).orElseThrow(() ->
                new CustomException(ErrorCode.BOOK_NOT_FOUND));

        Nest nest = user.getNest();
        if(nest.getId() != request.getNestId()){
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        BookNest bookNest = bookNestRepository.findByNestIdAndBookId(nest.getId(), book.getId()).orElseThrow(() ->
                new CustomException(ErrorCode.BOOKNEST_NOT_FOUND));

        bookNestRepository.delete(bookNest);
    }

    // 찜하기 등록
    @Transactional
    public void addBookMark(Integer userId, Integer bookId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Nest nest = nestRepository.findByUser(user)
                .orElseThrow(() -> new CustomException(ErrorCode.NEST_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        if (bookMarkRepository.existsByNestIdAndBookId(nest.getId(), bookId)) {
            throw new CustomException(ErrorCode.ALREADY_BOOKMARKED);
        }

        BookMark bookMark = BookMark.builder()
                .nest(nest)
                .book(book)
                .build();

        bookMarkRepository.save(bookMark);
    }

    // 찜하기 취소
    @Transactional
    public void removeBookMark(Integer userId, Integer bookId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));


        Nest nest = nestRepository.findByUser(user)
                .orElseThrow(() -> new CustomException(ErrorCode.NEST_NOT_FOUND));


        BookMark bookMark = bookMarkRepository.findByNestIdAndBookId(nest.getId(), bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOKMARK_NOT_FOUND));


        bookMarkRepository.delete(bookMark);
    }

    // 찜목록 조회
    @Transactional(readOnly = true)
    public List<BookMarkListResponse> getBookMarkList(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Nest nest = nestRepository.findByUser(user)
                .orElseThrow(() -> new CustomException(ErrorCode.NEST_NOT_FOUND));

        return nest.getBookMarks().stream()
                .map(bookMark -> BookMarkListResponse.of(bookMark.getBook(), bookMark.getCreatedAt()))
                .toList();
    }


}