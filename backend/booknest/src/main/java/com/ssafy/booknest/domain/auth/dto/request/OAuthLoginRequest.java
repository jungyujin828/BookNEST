package com.ssafy.booknest.domain.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class OAuthLoginRequest {
    private String code;
}
