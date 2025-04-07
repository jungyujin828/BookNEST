package com.ssafy.booknest.domain.book.controller;

import com.ssafy.booknest.domain.book.dto.response.*;
import com.ssafy.booknest.domain.book.enums.BookEvalType;
import com.ssafy.booknest.domain.book.service.BookService;
import com.ssafy.booknest.domain.book.service.FastApiService;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.AuthenticationUtil;
import com.ssafy.booknest.global.common.util.UserActionLogger;
import com.ssafy.booknest.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class BookController {

    private final BookService bookService;
    private final AuthenticationUtil authenticationUtil;
    private final FastApiService fastApiService;
    private final UserActionLogger userActionLogger;

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

        userActionLogger.logAction(userId, bookId, "click_book_detail");

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
    public ResponseEntity<ApiResponse<List<FastApiRecommendation>>> getTodayRecommendations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        List<FastApiRecommendation> books = fastApiService.getTodayRecommendations(userId);
        return ApiResponse.success(books);
    }

    // 대출 기록 기반 추천
    @GetMapping("/book-loan")
    public ResponseEntity<ApiResponse<List<FastApiRecommendation>>> getBookLoanRecommendations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        List<FastApiRecommendation> books = fastApiService.getBookLoanRecommendations(userId);
        return ApiResponse.success(books);
    }

    // 최근 키워드 기반 추천
    @GetMapping("/recent-keyword")
    public ResponseEntity<ApiResponse<List<FastApiRecommendation>>> getRecentKeywordRecommendations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        List<FastApiRecommendation> books = fastApiService.getRecentKeywordRecommendations(userId);
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

    // 나이대와 성별에 따른 추천
    @GetMapping("/age-gender")
    public ResponseEntity<ApiResponse<AgeGenderBookResult>> getAgeGenderBooks(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        List<AgeGenderBookResponse> books = bookService.getAgeGenderBooks(userId);

        AgeGenderBookResult result = AgeGenderBookResult.of(books);

        return ApiResponse.success(result);
    }

    // 태그별 랜덤 추천
    @GetMapping("/tag")
    public ResponseEntity<ApiResponse<TagBookResult>> getTagRandomBooks(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        List<TagBookResponse> books = bookService.getTagRandomBooks(userId);

        TagBookResult tagBookResult = TagBookResult.of(books);

        return ApiResponse.success(tagBookResult);
    }

    // 년도별 도서관 대여 순위 추천
    @GetMapping("/library")
    public ResponseEntity<ApiResponse<List<LibraryBookResponse>>> getLibraryBooks(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(value = "targetYear") Integer targetYear
    ) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        List<LibraryBookResponse> responseList = bookService.getLibraryBooksByYear(targetYear);
        return ApiResponse.success(responseList);
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
