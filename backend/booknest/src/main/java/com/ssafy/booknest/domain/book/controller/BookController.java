package com.ssafy.booknest.domain.book.controller;

import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.service.BookService;
import com.ssafy.booknest.domain.user.service.UserService;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.security.UserPrincipal;
import com.ssafy.booknest.global.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/book")
public class BookController {

    private final BookService bookService;
    private final UserService userService;

    @Autowired
    public BookController(BookService bookService, UserService userService) {
        this.bookService = bookService;
        this.userService = userService;
    }

    // 베스트 셀러
    @GetMapping("/best")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getBestSeller() {


        List<BookResponse> bestSellers = bookService.findBestSellers();

        return ApiResponse.success(bestSellers);
    }

//    @GetMapping("/rail/{sushiId}")
//    public ResponseEntity<ApiResponse<SushiOnRailResponse>> getRailSushi(
//            @AuthenticationPrincipal UserPrincipal userPrincipal,
//            @PathVariable("sushiId") Integer sushiId) {
//        Integer userId = userPrincipal.getId();
//
//        return ApiResponse.success(sushiService.getRailSushi(userId, sushiId));
//    }

//    // 내 지역에서 가장 많이 읽은 책
//    @GetMapping("/region")
//    public ResponseEntity<List<BookResponse>> getMostReadBooksByRegion(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//        Integer userId = userPrincipal.getId();
//
//        List<BookResponse> mostReadBooksByRegion = bookService.findMostReadBooksByRegion(userId);
//
//        return ResponseEntity.ok(mostReadBooksByRegion);
//    }
//
//    // 내 성별과 나이대에서 많이 읽은 책
//    @GetMapping("/age")
//    public ResponseEntity<List<BookResponse>> getMostReadBooksByGenderAndAge(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//        Integer userId = userPrincipal.getId();
//
//        List<BookResponse> mostReadBooksByGenderAndAge = bookService.findMostReadBooksByGenderAndAge(userId);
//
//        return ResponseEntity.ok(mostReadBooksByGenderAndAge);
//    }
//
//    // 화제의 작가 책
//    @GetMapping("/author")
//    public ResponseEntity<List<BookResponse>> getBooksByPopularAuthor(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//        Integer userId = userPrincipal.getId();
//
//        List<BookResponse> booksByPopularAuthor = bookService.findBooksByPopularAuthor(userId);
//
//        return ResponseEntity.ok(booksByPopularAuthor);
//    }
//
//    // 평론가 추천 책
//    @GetMapping("/critic")
//    public ResponseEntity<List<BookResponse>> getBooksByCritic(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//        Integer userId = userPrincipal.getId();
//
//        List<BookResponse> booksByCritic = bookService.findBooksByCritic(userId);
//
//        return ResponseEntity.ok(booksByCritic);
//    }
//
//    // 최근 평점 준 작가와 연관 추천
//    @GetMapping("authorrating")
//    public ResponseEntity<List<BookResponse>> getBooksByAuthorRating(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//        Integer userId = userPrincipal.getId();
//
//        List<BookResponse> booksByAuthorRating = bookService.findBooksByAuthorRating(userId);
//
//        return ResponseEntity.ok(booksByAuthorRating);
//    }
}
