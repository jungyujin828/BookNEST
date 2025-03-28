package com.ssafy.booknest.domain.nest.controller;

import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.nest.dto.request.AddBookNestRequest;
import com.ssafy.booknest.domain.nest.dto.request.BookMarkRequest;
import com.ssafy.booknest.domain.nest.dto.request.NestRequest;
import com.ssafy.booknest.domain.nest.dto.response.AddBookNestResponse;
import com.ssafy.booknest.domain.nest.dto.response.BookMarkListResponse;
import com.ssafy.booknest.domain.nest.dto.response.NestBookListResponse;
import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.domain.nest.service.NestService;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.AuthenticationUtil;
import com.ssafy.booknest.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/nest")
public class NestController {

    private final NestService nestService;
    private final AuthenticationUtil authenticationUtil;

    @GetMapping("")
    public ResponseEntity<ApiResponse<CustomPage<NestBookListResponse>>> getNestBookList(
            @RequestBody NestRequest nestRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            Pageable pageable) {
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        Integer nestId = nestRequest.getNestId();
        Integer nestUserId = nestRequest.getUserId();
        return ApiResponse.success(nestService.getNestBookList(userId, nestId, nestUserId, pageable));
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<AddBookNestResponse>> addBookNest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody AddBookNestRequest addBookNestRequest){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        return ApiResponse.success(nestService.addBookNest(userId, addBookNestRequest), HttpStatus.CREATED);
    }

    // 찜하기 등록
    @PostMapping("/bookmark")
    public ResponseEntity<ApiResponse<Void>> addBookMark(
            @RequestBody BookMarkRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        Integer bookId = request.getBookId();

        nestService.addBookMark(userId, bookId);
        return ApiResponse.success(HttpStatus.CREATED);
    }

    // 찜하기 취소
    @DeleteMapping("/bookmark")
    public ResponseEntity<ApiResponse<Void>> removeBookMark(
            @RequestBody BookMarkRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        Integer bookId = request.getBookId();

        nestService.removeBookMark(userId, bookId);
        return ApiResponse.success(HttpStatus.OK);
    }

    // 찜목록 조회
    @GetMapping("/bookmark")
    public ResponseEntity<ApiResponse<List<BookMarkListResponse>>> getBookMarkList(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        List<BookMarkListResponse> responseList = nestService.getBookMarkList(userId);

        return ApiResponse.success(responseList);
    }

}
