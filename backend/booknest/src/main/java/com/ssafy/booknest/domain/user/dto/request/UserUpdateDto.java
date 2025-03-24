package com.ssafy.booknest.domain.user.dto.request;


import com.ssafy.booknest.domain.user.entity.Address;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.enums.Gender;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {

    private String nickname;
    private String gender; // "M", "F", "O"
    private String birthdate;
    private AddressDto address;
    private LocalDateTime updatedAt;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddressDto {
        private String zipcode;
        private String roadAddress;
        private String oldAddress;
    }


    public void applyTo(User user) {
        if (nickname != null && !nickname.isEmpty()) {
            user.updateNickname(nickname);
        }

        if (gender != null) {
            user.updateGender(Gender.valueOf(gender));
        }

        if (birthdate != null) {
            user.updateBirthdate(birthdate);
        }

        if (updatedAt != null) {
            user.updateUpdatedAt(updatedAt);
        }

        // 주소 업데이트
        if (address != null) {
            Address userAddress = user.getAddress();
            if (userAddress == null) {
                // 처음 등록되는 경우
                Address newAddress = Address.builder()
                        .roadAddress(address.getRoadAddress())
                        .oldAddress(address.getOldAddress())
                        .zipcode(address.getZipcode())
                        .city(extractCity(address.getRoadAddress()))
                        .district(extractDistrict(address.getRoadAddress()))
                        .user(user)
                        .build();
                user.setAddress(newAddress);
            } else {
                // 기존 주소 업데이트
                userAddress.updateAddress(
                        address.getRoadAddress(),
                        address.getOldAddress(),
                        address.getZipcode(),
                        extractCity(address.getRoadAddress()),
                        extractDistrict(address.getRoadAddress())
                );
            }
        }
    }

    // 도/시 추출
    private String extractCity(String roadAddress) {
        if (roadAddress == null || roadAddress.isBlank()) return "";
        return roadAddress.split(" ")[0]; // 도/시 추출
    }

    // 구/군 추출
    private String extractDistrict(String roadAddress) {
        if (roadAddress == null || roadAddress.isBlank()) return "";
        String[] parts = roadAddress.split(" ");
        return parts.length > 1 ? parts[1] : ""; // 구/군 추출
    }
}
