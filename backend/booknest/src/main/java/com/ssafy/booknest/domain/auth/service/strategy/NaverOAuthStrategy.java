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

    //  기존 인터페이스 오버라이드
    @Override
    public OAuthUserInfo getUserInfo(String code) throws IOException {
        // 기본 구현에서는 state 고정
        return getUserInfo(code, "default-state");
    }

    // 네이버 전용 오버로딩 메서드
    public OAuthUserInfo getUserInfo(String code, String state) throws IOException {
        log.info("🧪 [NAVER] 로그인 요청 수신 - code: {}, state: {}", code, state);

        try {
            // 1. 액세스 토큰 발급 요청
            NaverTokenResponse tokenResponse = naverOAuthClient.getToken(code, state);
            log.info("✅ [NAVER] 액세스 토큰 발급 성공 - tokenResponse: {}", tokenResponse);

            // 2. 사용자 정보 조회 요청
            NaverUserResponse userResponse = naverOAuthClient.getUserInfo(tokenResponse.getAccessToken());

            // ✅ 응답을 JSON 문자열로 출력 (디버깅용)
            try {
                ObjectMapper mapper = new ObjectMapper();
                String json = mapper.writeValueAsString(userResponse);
                log.info("✅ [NAVER] 전체 응답 JSON: {}", json);
            } catch (Exception e) {
                log.warn("⚠️ [NAVER] 응답 JSON 변환 실패", e);
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

            // 4. 닉네임이 없는 경우 기본 닉네임 생성
            String nickname = user.getNickname();
            if (nickname == null || nickname.isBlank()) {
                nickname = "naver_user_" + UUID.randomUUID().toString().substring(0, 8);
                log.info("✅ [NAVER] 닉네임 없음 - 기본 닉네임 설정: {}", nickname);
            }

            // 5. 이메일이 없는 경우 로그만 남김 (에러는 발생시키지 않음)
            String email = user.getEmail();
            if (email == null || email.isBlank()) {
                log.warn("⚠️ [NAVER] 이메일이 제공되지 않음");
            }

            // 6. 사용자 정보 객체 반환
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

