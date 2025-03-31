package com.ssafy.booknest.global.infra.oauth.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.booknest.global.infra.oauth.constants.NaverOAuthConstants;
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

    public NaverTokenResponse getToken(String code, String state) throws IOException {
        RequestBody formBody = new FormBody.Builder()
                .add(NaverOAuthConstants.Parameters.GRANT_TYPE, NaverOAuthConstants.GrantTypes.AUTHORIZATION_CODE)
                .add(NaverOAuthConstants.Parameters.CLIENT_ID, clientId)
                .add(NaverOAuthConstants.Parameters.CLIENT_SECRET, clientSecret)
                .add(NaverOAuthConstants.Parameters.REDIRECT_URI, redirectUri)
                .add(NaverOAuthConstants.Parameters.CODE, code)
                .add(NaverOAuthConstants.Parameters.STATE, state) // ⭐️ state 추가!
                .build();

        Request request = new Request.Builder()
                .url(NaverOAuthConstants.Urls.TOKEN)
                .post(formBody)
                .build();

        try (Response response = okHttpClient.newCall(request).execute()) {
            assert response.body() != null;
            return objectMapper.readValue(response.body().string(), NaverTokenResponse.class);
        }
    }

    public NaverUserResponse getUserInfo(String accessToken) throws IOException {
        Request request = new Request.Builder()
                .url(NaverOAuthConstants.Urls.USER_INFO)
                .header("Authorization", "Bearer " + accessToken)
                .get()
                .build();

        try (Response response = okHttpClient.newCall(request).execute()) {
            assert response.body() != null;
            return objectMapper.readValue(response.body().string(), NaverUserResponse.class);
        }
    }
}
