package com.ssafy.booknest.domain.user.dto.response;

import com.ssafy.booknest.domain.user.entity.Address;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.enums.Gender;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserInfoResponse {
    private String nickname;
    private Gender gender;
    private String birthDate;
    private String roadAddress;
    private String zipcode;
//    private String profileURL;
    private Integer followers;
    private Integer followings;
    private Integer totalRatings;
    private Integer totalReviews;

    public static UserInfoResponse of(User user, Address address, Integer followers, Integer followings, Integer totalRatings, Integer totalReviews){
        return UserInfoResponse.builder()
                .nickname(user.getNickname())
                .gender(user.getGender())
                .birthDate(user.getBirthdate())
//                .profileURL(user.getProfileUrl())
                .roadAddress(address.getRoadAddress())
                .zipcode(address.getZipcode())
                .followers(followers)
                .followings(followings)
                .totalRatings(totalRatings)
                .totalReviews(totalReviews)
                .build();
    }
}