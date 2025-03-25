package com.ssafy.booknest.domain.auth.controller;

import com.ssafy.booknest.domain.auth.dto.LoginResult;
import com.ssafy.booknest.domain.auth.dto.request.OAuthLoginRequest;
import com.ssafy.booknest.domain.auth.dto.response.OAuthLoginResponse;
import com.ssafy.booknest.domain.auth.dto.response.TokenRefreshResponse;
import com.ssafy.booknest.domain.auth.service.OAuthService;
import com.ssafy.booknest.domain.user.enums.Provider;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.CookieUtil;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
public class OAuthController {
    private final OAuthService oAuthService;

    @PostMapping("/{provider}")
    public ResponseEntity<ApiResponse<OAuthLoginResponse>> socialLogin(
            @PathVariable String provider,
            @RequestBody OAuthLoginRequest request) {
        LoginResult loginResult = oAuthService.handleOAuthLogin(Provider.valueOf(provider.toUpperCase()), request.getCode());

        // RefreshToken을 HttpOnly 쿠키로 설정
        ResponseCookie responseCookie = CookieUtil.makeRefreshTokenCookie(loginResult.getRefreshToken());

        return ApiResponse.success(loginResult.getResponse(), responseCookie);
    }
}
