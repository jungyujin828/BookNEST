package com.ssafy.booknest.domain.nest.controller;

import com.ssafy.booknest.domain.nest.dto.request.NestRequest;
import com.ssafy.booknest.domain.nest.dto.response.NestBookListResponse;
import com.ssafy.booknest.domain.nest.service.NestService;
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
}