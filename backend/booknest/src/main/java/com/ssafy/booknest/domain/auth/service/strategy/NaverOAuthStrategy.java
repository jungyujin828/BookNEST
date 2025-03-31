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
            // 개발 중엔 고정값 사용
            String state = "test123";

            // access_token 발급
            NaverTokenResponse tokenResponse = naverOAuthClient.getToken(code, state);

            // 사용자 정보 요청
            NaverUserResponse userResponse = naverOAuthClient.getUserInfo(tokenResponse.getAccessToken());

            // 'response' 안에 실제 사용자 정보 있음
            NaverUserResponse.NaverAccount user = userResponse.getResponse();

            if (user == null || user.getId() == null) {
                System.out.println("❗ 네이버 응답에서 사용자 정보(response)가 없습니다.");
                throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
            }

            // 사용자 정보 반환
            return OAuthUserInfo.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .build();

        } catch (IOException e) {
            throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
        }
    }
}
