package com.ssafy.booknest.domain.book.controller;

import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.service.BookService;
import com.ssafy.booknest.domain.user.service.UserService;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.security.UserPrincipal;
import com.ssafy.booknest.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/book")
public class BookController {

    private final BookService bookService;
    private final UserService userService;

    @GetMapping("/best")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getBestSeller(@AuthenticationPrincipal UserPrincipal userPrincipal) {

        // 로그인한 사용자만 접근 가능
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 Unauthorized
        }

        List<BookResponse> bestSellers = bookService.getBestSellers();

        return ApiResponse.success(bestSellers);
    }

//    @GetMapping("/region")
//    public ResponseEntity<List<BookResponse>> getMostReadBooksByRegion(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//        Integer userId = userPrincipal.getId();
//
//        List<BookResponse> mostReadBooks = bookService.getMostReadBooksByRegion(userId);
//
//        return ResponseEntity.ok(mostReadBooks);
//    }

}
