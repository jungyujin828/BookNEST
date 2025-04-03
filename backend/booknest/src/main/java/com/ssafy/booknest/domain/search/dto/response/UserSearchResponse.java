package com.ssafy.booknest.domain.search.dto.response;

import com.ssafy.booknest.domain.search.record.SearchedBook;
import com.ssafy.booknest.domain.search.record.SerachedUser;
import lombok.Builder;

@Builder
public record UserSearchResponse(
        String id,
        String nickname,
        String profileURL
) {
    public static UserSearchResponse of(SerachedUser user) {
        return UserSearchResponse.builder()
                .id(user.id())
                .nickname(user.nickname())
                .profileURL(user.profileURL())
                .build();
    }
}
