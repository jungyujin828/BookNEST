package com.ssafy.booknest.domain.book.controller;

import com.ssafy.booknest.domain.book.dto.request.RatingRequest;
import com.ssafy.booknest.domain.book.dto.response.MyRatingResponse;
import com.ssafy.booknest.domain.book.dto.response.UserRatingResponse;
import com.ssafy.booknest.domain.book.service.RatingService;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.AuthenticationUtil;
import com.ssafy.booknest.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class RatingController {

    private final AuthenticationUtil authenticationUtil;
    private final RatingService ratingService;

    // 도서 평점 등록
    @PostMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<Void>> createBookRating(@PathVariable("bookId") Integer bookId,
                                                              @AuthenticationPrincipal UserPrincipal userPrincipal,
                                                              @RequestBody RatingRequest dto){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.createBookRating(userId, bookId, dto);
        return ApiResponse.success(HttpStatus.CREATED);
    }

    // 도서 평점 수정
    @PutMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<Void>> updateRating(@PathVariable("bookId") Integer bookId,
                                                          @AuthenticationPrincipal UserPrincipal userPrincipal,
                                                          @RequestBody RatingRequest dto){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.updateRating(userId, bookId, dto);
        return ApiResponse.success(HttpStatus.OK);
    }

    // 도서 평점 삭제
    @DeleteMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<Void>> deleteRating(@PathVariable("bookId") Integer bookId,
                                                          @AuthenticationPrincipal UserPrincipal userPrincipal){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.deleteRating(userId, bookId);
        return ApiResponse.success(HttpStatus.OK);
    }

    // 사용자 평점 목록 조회 (내 평점 또는 타인의 평점)
    @GetMapping("/rating")
    public ResponseEntity<ApiResponse<CustomPage<UserRatingResponse>>> getRatingList(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                                     @RequestParam(value = "targetId") Integer targetId,
                                                                                     Pageable pageable) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return ApiResponse.success(ratingService.getRatingList(userId, targetId, pageable));
    }

    // 내가 입력한 평점 조회
    @GetMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<MyRatingResponse>> getMyRating(@PathVariable Integer bookId,
                                                                     @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success(ratingService.getUserRating(userId, bookId));
    }

    // 도서 관심없음 등록
    @PostMapping("/{bookId}/ignore")
    public ResponseEntity<ApiResponse<Void>> ignoreBook(@PathVariable("bookId") Integer bookId,
                                                        @AuthenticationPrincipal UserPrincipal userPrincipal){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.ignoreBook(userId, bookId);
        return ApiResponse.success(HttpStatus.OK);
    }

    // 특정 도서 관심없음 조회
    @GetMapping("/{bookId}/ignore")
    public ResponseEntity<ApiResponse<Boolean>> isIgnoredBook(@PathVariable("bookId") Integer bookId,
                                                              @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success(ratingService.isBookIgnored(userId, bookId), HttpStatus.OK);
    }



    // 도서 관심없음 삭제
    @DeleteMapping("/{bookId}/ignore")
    public ResponseEntity<ApiResponse<Void>> cancelIgnoreBook(@PathVariable("bookId") Integer bookId,
                                                              @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.cancelIgnoredBook(userId, bookId);
        return ApiResponse.success(HttpStatus.OK);
    }
}
