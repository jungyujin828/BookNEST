package com.ssafy.booknest.domain.user.dto.response;

import com.ssafy.booknest.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserMypageResponse {
    private Integer nestId;
    private String nickname;
    private String profileURL;
    private Integer followers;
    private Integer followings;
    private Integer totalRatings;
    private Integer totalReviews;

    public static UserMypageResponse of(User user, Integer followers, Integer followings, Integer totalRatings, Integer totalReviews){
        return UserMypageResponse.builder()
                .nestId(user.getNest().getId())
                .nickname(user.getNickname())
                .profileURL("https://res.cloudinary.com/gominsushi/image/upload/v1743145995/bird_xbfc1j.png")
                .followers(followers)
                .followings(followings)
                .totalRatings(totalRatings)
                .totalReviews(totalReviews)
                .build();
    }
}
