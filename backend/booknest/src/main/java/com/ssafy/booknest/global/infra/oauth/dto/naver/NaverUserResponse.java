package com.ssafy.booknest.global.infra.oauth.dto.naver;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NaverUserResponse {
    private String resultcode;
    private String message;
    private NaverAccount response;

    @Getter
    @Setter
    public static class NaverAccount {
        private String id;
        private String email;
        private String nickname;
    }
}
