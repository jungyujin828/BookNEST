package com.ssafy.booknest.domain.auth.service.strategy;

import com.ssafy.booknest.domain.auth.dto.OAuthUserInfo;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import com.ssafy.booknest.global.infra.oauth.client.NaverOAuthClient;
import com.ssafy.booknest.global.infra.oauth.dto.naver.NaverTokenResponse;
import com.ssafy.booknest.global.infra.oauth.dto.naver.NaverUserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NaverOAuthStrategy implements OAuthStrategy {

    private final NaverOAuthClient naverOAuthClient;

    //  기존 인터페이스 오버라이드
    @Override
    public OAuthUserInfo getUserInfo(String code) throws IOException {
        // 기본 구현에서는 state 고정
        return getUserInfo(code, "default-state");
    }

    // 네이버 전용 오버로딩 메서드
    public OAuthUserInfo getUserInfo(String code, String state) throws IOException {
        log.info("🧪 [NAVER] code: {}, state: {}", code, state);
        try {
            // 1. 액세스 토큰 발급
            NaverTokenResponse tokenResponse = naverOAuthClient.getToken(code, state);
            log.info("🧪 [NAVER] tokenResponse: {}", tokenResponse);

            // 2. 사용자 정보 요청
            NaverUserResponse userResponse = naverOAuthClient.getUserInfo(tokenResponse.getAccessToken());
            log.info("🧪 [NAVER] userResponse: {}", userResponse);

            NaverUserResponse.NaverAccount user = userResponse.getResponse();
            log.info("🧪 [NAVER] userId: {}, email: {}, nickname: {}", user.getId(), user.getEmail(), user.getNickname());

            // 3. 유효성 검사
            if (user == null || user.getId() == null) {
                throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
            }

            // 4. 사용자 정보 매핑
            String nickname = user.getNickname();
            if (nickname == null || nickname.isBlank()) {
                // 닉네임이 없으면 임의의 닉네임 생성
                nickname = "naver_user_" + UUID.randomUUID().toString().substring(0, 8);
            }

            // 4. 사용자 정보 매핑
            return OAuthUserInfo.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .nickname(nickname)
                    .build();



        } catch (IOException e) {
            log.error("🧪 [NAVER] 사용자 정보 처리 실패", e);
            throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
        }

    }
}

