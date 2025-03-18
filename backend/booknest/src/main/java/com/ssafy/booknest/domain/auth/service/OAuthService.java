package com.ssafy.booknest.domain.auth.service;

import com.ssafy.booknest.domain.auth.dto.LoginResult;
import com.ssafy.booknest.domain.auth.dto.OAuthUserInfo;
import com.ssafy.booknest.domain.auth.dto.TokenValidationResult;
import com.ssafy.booknest.domain.auth.dto.response.OAuthLoginResponse;
import com.ssafy.booknest.domain.auth.dto.response.TokenRefreshResponse;
import com.ssafy.booknest.domain.auth.dto.response.UserInfoResponse;
import com.ssafy.booknest.domain.auth.service.strategy.OAuthStrategy;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.enums.Provider;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import com.ssafy.booknest.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OAuthService {
    private final Map<Provider, OAuthStrategy> oAuthStrategyMap;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResult handleOAuthLogin(Provider provider, String code) {

        // 1. 전략 가져오기
        OAuthStrategy strategy = oAuthStrategyMap.get(provider);
        if (strategy == null) {
            throw new CustomException(ErrorCode.INVALID_OAUTH_PROVIDER);
        }

        try {
            // 2. 소셜 로그인으로 유저 정보 받아오기
            OAuthUserInfo userInfo = strategy.getUserInfo(code);
            log.debug("Received user info from provider - id: {}, email: {}",
                    userInfo.getId(), userInfo.getEmail());

            // 3. 유저 정보로 로그인 처리하기

            // 3. 기존 회원인지 확인
            Optional<User> existingUser = userRepository.findByProviderAndProviderId(
                    provider,
                    userInfo.getId() //providerId
            );

            Boolean isNew = existingUser.isEmpty();
            User user = existingUser.orElseGet(() ->  createUser(userInfo, provider));
            String userId = user.getId().toString();

            String accessToken = jwtTokenProvider.createAccessToken(userId);
            String refreshToken = jwtTokenProvider.createRefreshToken(userId);

//            // Redis에 RefreshToken 저장
//            authRedisService.saveRefreshToken(userId, refreshToken);

            UserInfoResponse userInfoResponse = UserInfoResponse.of(user, isNew);
            OAuthLoginResponse oAuthLoginResponse = OAuthLoginResponse.of(accessToken, userInfoResponse);

            return LoginResult.of(oAuthLoginResponse, refreshToken);

        } catch (Exception e) {
            log.error("Failed to process OAuth login for provider: {} message: {}", provider, e.getMessage());
            throw new CustomException(ErrorCode.OAUTH_SERVER_ERROR);
        }
    }

    private User createUser(OAuthUserInfo userInfo, Provider provider) {
        User newUser = User.builder()
                .nickname(userInfo.getNickname())
                .provider(provider)
                .providerId(userInfo.getId())
                .build();

        return userRepository.save(newUser);
    }

    public TokenRefreshResponse refreshToken(String refreshToken) {
        // 1. Refresh 토큰 유효성 검증
        TokenValidationResult validationResult = jwtTokenProvider.validateToken(refreshToken);
        if (!validationResult.isValid()) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

//        // 2. Redis에 저장된 Refresh 토큰과 비교
        String userId = jwtTokenProvider.getUserId(refreshToken).toString();
//        String savedRefreshToken = authRedisService.getRefreshToken(userId);
//
//        if (savedRefreshToken == null || !savedRefreshToken.equals(refreshToken)) {
//            throw new CustomException(ErrorCode.REFRESH_TOKEN_MISMATCH);
//        }

        // 3. 새로운 Access 토큰 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(userId);

        return new TokenRefreshResponse(newAccessToken);
    }
}
