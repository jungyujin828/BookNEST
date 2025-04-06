package com.ssafy.booknest.domain.user.dto.response;

import com.ssafy.booknest.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserMypageResponse {
    private Integer nestId;
    private String nickname;
    private String archetype;
    private String profileURL;
    private Integer followers;
    private Integer followings;
    private Integer totalRatings;
    private Integer totalReviews;
    private Boolean isFollowing;

    public static UserMypageResponse of(User user, Integer followers, Integer followings, Integer totalRatings, Integer totalReviews, Boolean isFollowing){
        return UserMypageResponse.builder()
                .nestId(user.getNest().getId())
                .nickname(user.getNickname())
                .archetype(user.getArcheType())
                .profileURL(user.getProfileUrl())
                .followers(followers)
                .followings(followings)
                .totalRatings(totalRatings)
                .totalReviews(totalReviews)
                .isFollowing(isFollowing)
                .build();
    }
}
