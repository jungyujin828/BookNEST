package com.ssafy.booknest.global.infra.oauth.dto.naver;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NaverUserResponse {

    private NaverAccount response;

    @Getter
    @NoArgsConstructor
    public static class NaverAccount {
        private String id;
        private String email;
        private String nickname;
        private String name;
        private String profile_image;
    }
}
