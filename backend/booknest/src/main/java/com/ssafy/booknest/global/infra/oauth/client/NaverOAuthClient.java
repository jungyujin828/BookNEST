package com.ssafy.booknest.global.infra.oauth.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.booknest.global.infra.oauth.dto.naver.NaverTokenResponse;
import com.ssafy.booknest.global.infra.oauth.dto.naver.NaverUserResponse;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class NaverOAuthClient {
    private final OkHttpClient okHttpClient;
    private final ObjectMapper objectMapper;

    @Value("${oauth.naver.client-id}")
    private String clientId;

    @Value("${oauth.naver.client-secret}")
    private String clientSecret;

    @Value("${oauth.naver.redirect-uri}")
    private String redirectUri;

    private static final String TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
    private static final String USER_INFO_URL = "https://openapi.naver.com/v1/nid/me";

    public NaverTokenResponse getToken(String code, String state) throws IOException {
        RequestBody formBody = new FormBody.Builder()
                .add("grant_type", "authorization_code")
                .add("client_id", clientId)
                .add("client_secret", clientSecret)
                .add("redirect_uri", redirectUri)
                .add("code", code)
                .add("state", state)
                .build();

        Request request = new Request.Builder()
                .url(TOKEN_URL)
                .post(formBody)
                .build();

        try (Response response = okHttpClient.newCall(request).execute()) {
            assert response.body() != null;
            return objectMapper.readValue(response.body().string(), NaverTokenResponse.class);
        }
    }

    public NaverUserResponse getUserInfo(String accessToken) throws IOException {
        Request request = new Request.Builder()
                .url(USER_INFO_URL)
                .header("Authorization", "Bearer " + accessToken)
                .get()
                .build();

        try (Response response = okHttpClient.newCall(request).execute()) {
            assert response.body() != null;
            return objectMapper.readValue(response.body().string(), NaverUserResponse.class);
        }
    }
}
