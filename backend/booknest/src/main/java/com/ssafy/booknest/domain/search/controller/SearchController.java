package com.ssafy.booknest.domain.search.controller;

import com.ssafy.booknest.domain.search.dto.response.BookSearchResponse;
import com.ssafy.booknest.domain.search.record.SearchedBook;
import com.ssafy.booknest.domain.search.service.SearchService;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.AuthenticationUtil;
import com.ssafy.booknest.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {

    private final AuthenticationUtil authenticationUtil;
    private final SearchService searchService;

    @GetMapping("/book")
    public ResponseEntity<ApiResponse<CustomPage<BookSearchResponse>>> searchBook(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String title,
            Pageable pageable) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);

        return ApiResponse.success(searchService.searchBooks(userId, title, pageable));
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<SearchedBook>> addBook(@RequestBody SearchedBook book) {
        SearchedBook savedBook = searchService.saveBook(book);
        return ApiResponse.success(savedBook);
    }
}
