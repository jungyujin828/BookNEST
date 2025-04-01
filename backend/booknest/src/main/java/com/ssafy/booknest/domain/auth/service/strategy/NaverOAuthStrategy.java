package com.ssafy.booknest.domain.auth.service.strategy;

import com.fasterxml.jackson.databind.ObjectMapper;
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

    @Override
    public OAuthUserInfo getUserInfo(String code) throws IOException {
        return getUserInfo(code, "default-state");
    }

    public OAuthUserInfo getUserInfo(String code, String state) throws IOException {
        log.info("🧪 [NAVER] 로그인 요청 수신 - code: {}, state: {}", code, state);

        try {
            // 1. 액세스 토큰 발급 요청
            NaverTokenResponse tokenResponse = naverOAuthClient.getToken(code, state);

            // ✅ 디버깅: 토큰 응답 정보 자세히 출력
            log.info("✅ [NAVER] access_token = {}", tokenResponse.getAccessToken());
            log.info("✅ [NAVER] refresh_token = {}", tokenResponse.getRefreshToken());
            log.info("✅ [NAVER] token_type = {}", tokenResponse.getTokenType());
            log.info("✅ [NAVER] expires_in = {}", tokenResponse.getExpiresIn());
            // 필요시 scope 도 출력 (토큰 응답에 포함된다면)
            try {
                ObjectMapper mapper = new ObjectMapper();
                log.info("✅ [NAVER] 전체 토큰 응답 JSON = {}", mapper.writeValueAsString(tokenResponse));
            } catch (Exception e) {
                log.warn("⚠️ [NAVER] 토큰 응답 JSON 변환 실패", e);
            }

            // 2. 사용자 정보 조회 요청
            NaverUserResponse userResponse = naverOAuthClient.getUserInfo(tokenResponse.getAccessToken());

            // ✅ 사용자 정보 전체 JSON 출력
            try {
                ObjectMapper mapper = new ObjectMapper();
                log.info("✅ [NAVER] 사용자 응답 JSON = {}", mapper.writeValueAsString(userResponse));
            } catch (Exception e) {
                log.warn("⚠️ [NAVER] 사용자 응답 JSON 변환 실패", e);
            }

            // 3. 사용자 정보 추출
            NaverUserResponse.NaverAccount user = userResponse.getResponse();
            if (user == null) {
                log.warn("⚠️ [NAVER] user 객체가 null입니다. userResponse: {}", userResponse);
                throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
            }

            if (user.getId() == null) {
                log.warn("⚠️ [NAVER] userId가 null입니다. user: {}", user);
                throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
            }

            log.info("✅ [NAVER] 사용자 정보 - id: {}, email: {}, nickname: {}", user.getId(), user.getEmail(), user.getNickname());

            // 닉네임 없으면 기본값 생성
            String nickname = user.getNickname();
            if (nickname == null || nickname.isBlank()) {
                nickname = "naver_user_" + UUID.randomUUID().toString().substring(0, 8);
                log.info("✅ [NAVER] 닉네임 없음 - 기본 닉네임 설정: {}", nickname);
            }

            String email = user.getEmail();
            if (email == null || email.isBlank()) {
                log.warn("⚠️ [NAVER] 이메일이 제공되지 않음");
            }

            return OAuthUserInfo.builder()
                    .id(user.getId())
                    .email(email)
                    .nickname(nickname)
                    .build();

        } catch (IOException e) {
            log.error("❌ [NAVER] 사용자 정보 처리 중 IOException 발생", e);
            throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
        } catch (Exception e) {
            log.error("❌ [NAVER] 알 수 없는 예외 발생", e);
            throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
        }
    }
}
