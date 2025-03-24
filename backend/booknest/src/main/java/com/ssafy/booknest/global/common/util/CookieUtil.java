package com.ssafy.booknest.global.common.util;

import org.springframework.http.ResponseCookie;

import java.time.Duration;

public class CookieUtil {

    public static ResponseCookie makeRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true) // HTTPS 환경에서만 전송
                .sameSite("Strict") // CSRF 방지
                .domain(".mybooknest.site")
                .path("/") // 모든 경로에서 접근 가능
                .maxAge(Duration.ofDays(14)) // 14일 유효
                .build();
    }
}