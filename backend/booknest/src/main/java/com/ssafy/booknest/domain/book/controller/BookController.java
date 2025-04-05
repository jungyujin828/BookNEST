package com.ssafy.booknest.domain.book.controller;

import com.ssafy.booknest.domain.book.dto.request.RatingRequest;
import com.ssafy.booknest.domain.book.dto.request.ReviewRequest;
import com.ssafy.booknest.domain.book.dto.response.*;
import com.ssafy.booknest.domain.book.entity.PopularAuthorBook;
import com.ssafy.booknest.domain.book.enums.BookEvalType;
import com.ssafy.booknest.domain.book.enums.BookSearchType;
import com.ssafy.booknest.domain.book.repository.PopularAuthorBookRepository;
import com.ssafy.booknest.domain.book.service.BookService;
import com.ssafy.booknest.domain.book.service.FastApiService;
import com.ssafy.booknest.domain.book.service.RatingService;
import com.ssafy.booknest.domain.book.service.ReviewService;
import com.ssafy.booknest.domain.user.service.UserService;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.AuthenticationUtil;
import com.ssafy.booknest.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class BookController {

    private final BookService bookService;
    private final UserService userService;
    private final AuthenticationUtil authenticationUtil;
    private final ReviewService reviewService;
    private final RatingService ratingService;
    private final FastApiService fastApiService;
    private final PopularAuthorBookRepository popularAuthorBookRepository;

    // 베스트 셀러 목록 조회
    @GetMapping("/best")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getBestSeller(@AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success(bookService.getBestSellers());
    }


    // 도서 상세
    @GetMapping("/{bookId}")
    public ResponseEntity<ApiResponse<BookDetailResponse>> getBook(@PathVariable("bookId") Integer bookId,
                                                                   @AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                   Pageable pageable) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return ApiResponse.success(bookService.getBook(userId, bookId, pageable));
    }

    // 책 구매사이트 연계
    @GetMapping("/{bookId}/purchase")
    public ResponseEntity<ApiResponse<BookPurchaseResponse>> getPurchaseLinks(@PathVariable("bookId") Integer bookId,
                                                                              @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success(bookService.getPurchaseLinks(bookId));
    }

    // 오늘의 추천
    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<FastApiRecommendation>>> getRecommendations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        List<FastApiRecommendation> books = fastApiService.getRecommendations(userId);
        return ApiResponse.success(books);
    }

    // 가짜 오추 메서드
    @GetMapping("/fake")
    public ResponseEntity<ApiResponse<List<FakeResponse>>> getFakes(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        List<FakeResponse> books = bookService.getfakes(userId);
        return ApiResponse.success(books);
    }

    // 평론가 추천 책(랜덤으로 한 명 평론가 추천 책들이 보여짐)
    @GetMapping("/critic")
    public ResponseEntity<ApiResponse<List<CriticBookResponse>>> getCriticBooks(
            @AuthenticationPrincipal UserPrincipal userPrincipal){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        List<CriticBookResponse> books = bookService.getCriticBooks(userId);
        return ApiResponse.success(books);
    }

    // 화제의 작가 책 추천
    @GetMapping("/author")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getAuthorBooks(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        List<BookResponse> books = bookService.getAuthorBooks(userId);
        return ApiResponse.success(books);
    }


    @GetMapping("/eval")
    public ResponseEntity<ApiResponse<CustomPage<BookResponse>>> getEvalBookList(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "RANDOM") BookEvalType keyword,
            Pageable pageable){

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success(bookService.getEvalBookList(userId, keyword, pageable));
    }


//    // 내 지역에서 가장 많이 읽은 책
//    @GetMapping("/region")
//    public ResponseEntity<ApiResponse<List<BookResponse>>> getMostReadBooksByRegion(
//            @AuthenticationPrincipal UserPrincipal userPrincipal) {
//
//        // 로그인한 사용자만 접근 가능
//        if (userPrincipal == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        List<BookResponse> mostReadBooks = bookService.getMostReadBooksByRegion();
//
//        return ApiResponse.success(mostReadBooks);
//    }






    // 전자도서관 연계
//    @GetMapping("/{bookId}/ebook")
//    public ResponseEntity<ApiResponse<List<String>>> getOnlineLibrary(@PathVariable("bookId") Integer bookId,
//                                                                  @AuthenticationPrincipal UserPrincipal userPrincipal){
//        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
//
//        return ApiResponse.success((bookService.getOnlineLibrary(userId, bookId)));
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
