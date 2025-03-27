package com.ssafy.booknest.domain.auth.service.strategy;

import com.ssafy.booknest.domain.auth.dto.OAuthUserInfo;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import com.ssafy.booknest.global.infra.oauth.client.NaverOAuthClient;
import com.ssafy.booknest.global.infra.oauth.dto.naver.NaverTokenResponse;
import com.ssafy.booknest.global.infra.oauth.dto.naver.NaverUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class NaverOAuthStrategy implements OAuthStrategy {

    private final NaverOAuthClient naverOAuthClient;

    @Override
    public OAuthUserInfo getUserInfo(String code) throws IOException {
        try {
            // 보통 네이버는 state도 필요함
            String state = "dummy-state"; // 실제 구현에서는 세션 또는 프론트에서 전달받은 state 사용

            NaverTokenResponse tokenResponse = naverOAuthClient.getToken(code, state);
            NaverUserResponse userResponse = naverOAuthClient.getUserInfo(tokenResponse.getAccessToken());

            return OAuthUserInfo.builder()
                    .id(userResponse.getResponse().getId())
                    .email(userResponse.getResponse().getEmail())
                    .nickname(userResponse.getResponse().getNickname())
                    .build();
        } catch (Exception e) {
            throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
        }
    }
}
