package com.ssafy.booknest.domain.auth.service;

import com.ssafy.booknest.domain.auth.service.strategy.OAuthStrategy;
import com.ssafy.booknest.domain.user.enums.Provider;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OAuthService {
    private final Map<Provider, OAuthStrategy> oAuthStrategyMap;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
}
