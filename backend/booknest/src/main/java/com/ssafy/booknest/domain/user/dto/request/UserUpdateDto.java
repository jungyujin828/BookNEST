package com.ssafy.booknest.domain.user.dto.request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {
    private String nickname;
    private String gender; // "M", "F", "O"
    private String birthdate;
    private AddressDto address;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddressDto {
        private String zipcode;
        private String roadAddress;
        private String oldAddress;
    }
}
