package com.ssafy.booknest.domain.user.service;

import com.ssafy.booknest.domain.user.dto.request.UserUpdateDto;
import com.ssafy.booknest.domain.user.entity.Address;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.enums.Gender;
import com.ssafy.booknest.domain.user.repository.AddressRepository;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    @Transactional
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        userRepository.delete(user);

    }

    public Boolean existsById(Integer userId) {
        return userRepository.existsById(userId);
    }

    // 회원정보 수정
    @Transactional
    public void updateUser(Integer userId, UserUpdateDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 닉네임
        if (dto.getNickname() != null && !dto.getNickname().isEmpty()) {
            user.updateNickname(dto.getNickname());
        }

        // 성별
        if (dto.getGender() != null) {
            user.updateGender(Gender.valueOf(dto.getGender()));
        }

        // 생년월일
        if (dto.getBirthdate() != null) {
            user.updateBirthdate(dto.getBirthdate());
        }

        // 주소
        if (dto.getAddress() != null) {
            UserUpdateDto.AddressDto addr = dto.getAddress();
            Address current = user.getAddress();

            String city = extractCity(addr.getRoadAddress());
            String district = extractDistrict(addr.getRoadAddress());

            if (current == null) {
                // 처음 등록
                Address newAddress = Address.builder()
                        .roadAddress(addr.getRoadAddress())
                        .oldAddress(addr.getOldAddress())
                        .zipcode(addr.getZipcode())
                        .city(city)
                        .district(district)
                        .user(user)
                        .build();

                addressRepository.save(newAddress); // ⭐ DB 저장 확실하게
                user.setAddress(newAddress);
            } else {
                // 기존 주소 수정
                current.updateAddress(
                        addr.getRoadAddress(),
                        addr.getOldAddress(),
                        addr.getZipcode(),
                        city,
                        district
                );
            }
        }
    }

    private String extractCity(String roadAddress) {
        if (roadAddress == null || roadAddress.isBlank()) return "";
        return roadAddress.split(" ")[0];
    }

    private String extractDistrict(String roadAddress) {
        if (roadAddress == null || roadAddress.isBlank()) return "";
        String[] parts = roadAddress.split(" ");
        return parts.length > 1 ? parts[1] : "";
    }


    // 닉네임 중복확인
    public boolean isNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
}
