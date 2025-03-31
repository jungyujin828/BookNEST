package com.ssafy.booknest.domain.user.dto.response;

import com.ssafy.booknest.domain.user.entity.Address;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.enums.Gender;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserInfoResponse {
    private Integer userId;
    private String nickname;
    private Gender gender;
    private String birthDate;
    private String roadAddress;
    private String zipcode;
    private String profileURL;
    private Integer followers;
    private Integer followings;
    private Integer totalRatings;
    private Integer totalReviews;

    public static UserInfoResponse of(User user, Address address, Integer followers, Integer followings, Integer totalRatings, Integer totalReviews){
        return UserInfoResponse.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .gender(user.getGender())
                .birthDate(user.getBirthdate())
                .profileURL("https://res.cloudinary.com/gominsushi/image/upload/v1743145995/bird_xbfc1j.png")
                .roadAddress(address.getRoadAddress())
                .zipcode(address.getZipcode())
                .followers(followers)
                .followings(followings)
                .totalRatings(totalRatings)
                .totalReviews(totalReviews)
                .build();
    }
}