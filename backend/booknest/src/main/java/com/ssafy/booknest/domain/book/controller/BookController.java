package com.ssafy.booknest.domain.book.controller;

import com.ssafy.booknest.domain.book.dto.response.BookDetailResponse;
import com.ssafy.booknest.domain.book.dto.response.BookPurchaseResponse;
import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.dto.response.BookSearchResponse;
import com.ssafy.booknest.domain.book.enums.BookSearchType;
import com.ssafy.booknest.domain.book.service.BookService;
import com.ssafy.booknest.domain.user.service.UserService;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.AuthenticationUtil;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import com.ssafy.booknest.global.security.UserPrincipal;
import com.ssafy.booknest.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static com.ssafy.booknest.global.error.ErrorCode.BOOK_NOT_FOUND;
import static com.ssafy.booknest.global.error.ErrorCode.UNAUTHORIZED_ACCESS;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class BookController {

    private final BookService bookService;
    private final UserService userService;
    private final AuthenticationUtil authenticationUtil;

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

    // 전자도서관 연계
    @GetMapping("/{bookId}/ebook")
    public ResponseEntity<ApiResponse<List<String>>> getOnlineLibrary(@PathVariable("bookId") Integer bookId,
                                                                  @AuthenticationPrincipal UserPrincipal userPrincipal){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success((bookService.getOnlineLibrary(userId, bookId)));
    }

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
