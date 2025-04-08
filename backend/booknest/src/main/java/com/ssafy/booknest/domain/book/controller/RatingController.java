package com.ssafy.booknest.domain.book.controller;

import com.ssafy.booknest.domain.book.dto.request.RatingRequest;
import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.dto.response.MyRatingResponse;
import com.ssafy.booknest.domain.book.dto.response.UserRatingResponse;
import com.ssafy.booknest.domain.book.service.RatingService;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.AuthenticationUtil;
import com.ssafy.booknest.global.common.util.UserActionLogger;
import com.ssafy.booknest.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class RatingController {

    private final AuthenticationUtil authenticationUtil;
    private final RatingService ratingService;
    private final UserActionLogger userActionLogger;

    // 도서 평점 등록
    @PostMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<Void>> createBookRating(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody RatingRequest dto){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.createBookRating(userId, bookId, dto);

        userActionLogger.logAction(userId, bookId, "rating_star_" + dto.getScore());

        return ApiResponse.success(HttpStatus.CREATED);
    }

    // 도서 평점 수정
    @PutMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<Void>> updateRating(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody RatingRequest dto){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        Double score = ratingService.updateRating(userId, bookId, dto);

        userActionLogger.logAction(userId, bookId, "update_rating_star_" + score + "_" + dto.getScore());

        return ApiResponse.success(HttpStatus.OK);
    }

    // 도서 평점 삭제
    @DeleteMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<Void>> deleteRating(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        Double score = ratingService.deleteRating(userId, bookId);

        userActionLogger.logAction(userId, bookId, "rating_cancel_" + score);

        return ApiResponse.success(HttpStatus.OK);
    }

    // 사용자 평점 목록 조회 (내 평점 또는 타인의 평점)
    @GetMapping("/rating")
    public ResponseEntity<ApiResponse<CustomPage<UserRatingResponse>>> getRatingList(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(value = "targetId") Integer targetId,
            Pageable pageable) {

        return ApiResponse.success(ratingService.getRatingList(targetId, pageable));
    }

    // 내가 입력한 점수 불려오기
    @GetMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<MyRatingResponse>> getMyRating(
            @PathVariable Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        MyRatingResponse response = ratingService.getUserRating(userId, bookId);
        return ApiResponse.success(response);
    }

    // 취향분석에서 책 관심없음 등록
    @PostMapping("/{bookId}/ignore")
    public ResponseEntity<ApiResponse<Void>> ignoreBook(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.ignoreBook(userId, bookId);

        userActionLogger.logAction(userId, bookId, "click_dislike");

        return ApiResponse.success(HttpStatus.OK);
    }

    // 특정 도서에 대해 관심없음 여부 확인
    @GetMapping("/{bookId}/ignore")
    public ResponseEntity<ApiResponse<Boolean>> isIgnoredBook(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        boolean isIgnored = ratingService.isBookIgnored(userId, bookId);

        return ApiResponse.success(isIgnored, HttpStatus.OK);
    }


    // 관심없음 삭제
    @DeleteMapping("/{bookId}/ignore")
    public ResponseEntity<ApiResponse<Void>> cancelIgnoreBook(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.cancelIgnoredBook(userId, bookId);
        return ApiResponse.success(HttpStatus.OK);
    }
}
