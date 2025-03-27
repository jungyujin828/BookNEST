package com.ssafy.booknest.domain.book.controller;

import com.ssafy.booknest.domain.book.dto.request.RatingRequest;
import com.ssafy.booknest.domain.book.dto.request.ReviewRequest;
import com.ssafy.booknest.domain.book.dto.response.BookDetailResponse;
import com.ssafy.booknest.domain.book.dto.response.BookPurchaseResponse;
import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.service.BookService;
import com.ssafy.booknest.domain.book.service.RatingService;
import com.ssafy.booknest.domain.book.service.ReviewService;
import com.ssafy.booknest.domain.user.service.UserService;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.AuthenticationUtil;
import com.ssafy.booknest.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class BookController {

    private final BookService bookService;
    private final UserService userService;
    private final AuthenticationUtil authenticationUtil;
    private final ReviewService reviewService;
    private final RatingService ratingService;

    // 베스트 셀러 목록 조회
    @GetMapping("/best")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getBestSeller(@AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success(bookService.getBestSellers());
    }


    // 개별 도서 조회
    @GetMapping("/{bookId}")
    public ResponseEntity<ApiResponse<BookDetailResponse>> getBook(@PathVariable("bookId") Integer bookId,
                                                                   @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success(bookService.getBook(userId, bookId));
    }


    // 책 구매사이트 연계
    @GetMapping("/{bookId}/purchase")
    public ResponseEntity<ApiResponse<BookPurchaseResponse>> getPurchaseLinks(@PathVariable("bookId") Integer bookId,
                                                                              @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success(bookService.getPurchaseLinks(bookId));
    }


    // 한줄평 등록
    @PostMapping("/{bookId}/review")
    public ResponseEntity<ApiResponse<Void>> addReview(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ReviewRequest reviewRequest
    ) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        reviewService.saveReview(userId, bookId, reviewRequest);
        return ApiResponse.success(HttpStatus.OK);
    }

    // 한줄평 수정
    @PutMapping("/{bookId}/review")
    public ResponseEntity<ApiResponse<Void>> updateReview(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ReviewRequest reviewRequest
    ){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        reviewService.updateReview(userId, bookId, reviewRequest);
        return ApiResponse.success(HttpStatus.OK);
    }

    // 한줄평 삭제
    @DeleteMapping("/{bookId}/review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        reviewService.deleteReview(userId, bookId);
        return ApiResponse.success(HttpStatus.OK);
    }

    // 도서 평점 등록
    @PostMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<Void>> createBookRating(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody RatingRequest dto
    ){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.createBookRating(userId, bookId, dto);
        return ApiResponse.success(HttpStatus.CREATED);
    }

    // 도서 평점 수정
    @PutMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<Void>> updateRating(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody RatingRequest dto
    ){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.updateRating(userId, bookId, dto);
        return ApiResponse.success(HttpStatus.OK);
    }

    // 도서 평점 삭제
    @DeleteMapping("/{bookId}/rating")
    public ResponseEntity<ApiResponse<Void>> deleteRating(
            @PathVariable("bookId") Integer bookId,
            @AuthenticationPrincipal UserPrincipal userPrincipal){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        ratingService.deleteRating(userId, bookId);
        return ApiResponse.success(HttpStatus.OK);
    }


    //    // 도서 찜하기
//    @PutMapping("/{bookId}/like")
//    public ResponseEntity<ApiResponse<Void>> likeBook(
//            @PathVariable("bookId") Integer bookId,
//            @AuthenticationPrincipal UserPrincipal userPrincipal
//    ){
//        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
//        bookService.likeBook(userId, bookId);
//        return ApiResponse.success(HttpStatus.OK);
//    }


    // 전자도서관 연계
//    @GetMapping("/{bookId}/ebook")
//    public ResponseEntity<ApiResponse<List<String>>> getOnlineLibrary(@PathVariable("bookId") Integer bookId,
//                                                                  @AuthenticationPrincipal UserPrincipal userPrincipal){
//        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
//
//        return ApiResponse.success((bookService.getOnlineLibrary(userId, bookId)));
//    }


//    // 책 검색 (제목, 저자)
//    @GetMapping("/search")
//    public ResponseEntity<ApiResponse<BookSearchResponse>> getResultsByBookSearch(
//            @RequestParam String keyword,
//            @RequestParam(defaultValue = "TITLE") BookSearchType type,
//            @RequestParam(defaultValue = "1") int page,
//            @RequestParam(defaultValue = "5") int size
//    ) {
//        BookSearchResponse response = bookService.searchBooks(keyword, type, page, size);
//        return ApiResponse.success(response);
//    }






//    // 내 지역에서 가장 많이 읽은 책
//    @GetMapping("/region")
//    public ResponseEntity<ApiResponse<List<BookResponse>>> getMostReadBooksByRegion(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//
//        // 로그인한 사용자만 접근 가능
//        if (userPrincipal == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 Unauthorized
//        }
//
//        List<BookResponse> mostReadBooks = bookService.getMostReadBooksByRegion();
//
//        return ApiResponse.success(mostReadBooks);
//    }

}
