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
    }

    // 엔티티에 직접 반영
    public void applyTo(User user) {
        // 유저 정보 업데이트
        if (nickname != null) user.setNickname(nickname);
        if (gender != null) user.setGender(Gender.valueOf(gender));
        if (birthdate != null) user.setBirthdate(birthdate);
        user.setUpdatedAt(LocalDateTime.now());

        // 주소 정보 업데이트
        if (address != null) {
            Address addr = user.getAddress();

            if (addr == null) {
                // Address 처음 등록하는 경우
                Address newAddress = Address.builder()
                        .zipcode(address.getZipcode())
                        .roadAddress(address.getRoadAddress())
                        .oldAddress(address.getRoadAddress())
                        .city(extractCity(address.getRoadAddress()))
                        .district(extractDistrict(address.getRoadAddress()))
                        .user(user)
                        .build();
                user.setAddress(newAddress);
            } else {
                // 기존 Address 수정만 (INSERT 안 함)
                addr.setZipcode(address.getZipcode());
                addr.setRoadAddress(address.getRoadAddress());
                addr.setOldAddress(address.getRoadAddress());
                addr.setCity(extractCity(address.getRoadAddress()));
                addr.setDistrict(extractDistrict(address.getRoadAddress()));
            }
        }
    }


    // 도/시 추출
    private String extractCity(String roadAddress) {
        if (roadAddress == null || roadAddress.isBlank()) return "";
        return roadAddress.split(" ")[0];
    }

    // 구/군 추출
    private String extractDistrict(String roadAddress) {
        if (roadAddress == null || roadAddress.isBlank()) return "";
        String[] parts = roadAddress.split(" ");
        return parts.length > 1 ? parts[1] : "";
    }
}
