package com.ssafy.booknest.domain.nest.service;

import com.ssafy.booknest.domain.book.entity.Rating;
import com.ssafy.booknest.domain.book.entity.Review;
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
}