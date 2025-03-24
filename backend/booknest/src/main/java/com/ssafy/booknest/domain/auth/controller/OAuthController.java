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

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenRefreshResponse>> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {
        if (refreshToken == null) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        TokenRefreshResponse response = oAuthService.refreshToken(refreshToken);
        return ApiResponse.success(response);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        ResponseCookie deleteCookie = CookieUtil.deleteRefreshTokenCookie();

        return ResponseEntity
                .ok()
                .header("Set-Cookie", deleteCookie.toString())
                .body(new ApiResponse<>(true, null, null)); // 또는 아래처럼도 가능
    }
}
