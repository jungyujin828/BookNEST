package com.ssafy.booknest.domain.user.service;

import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.follow.repository.FollowRepository;
import com.ssafy.booknest.domain.user.dto.request.UserUpdateImgRequest;
import com.ssafy.booknest.domain.user.dto.response.UserInfoResponse;
import com.ssafy.booknest.domain.user.dto.request.UserUpdateRequest;
import com.ssafy.booknest.domain.user.dto.response.UserMypageResponse;
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
    private final FollowRepository followRepository;
    private final RatingRepository ratingRepository;
    private final ReviewRepository reviewRepository;

    @Transactional
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        followRepository.deleteAllByUserId(userId);

        user.updateDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public Boolean existsById(Integer userId) {
        return userRepository.existsById(userId);
    }

    // 회원정보 수정
    @Transactional
    public void updateUser(Integer userId, UserUpdateRequest dto) {
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
            UserUpdateRequest.AddressDto addr = dto.getAddress();
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

                addressRepository.save(newAddress);
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
        return userRepository.existsByNicknameAndDeletedAtIsNull(nickname);
    }

    // 유저 정보 조회
    public UserInfoResponse getUserInfo(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Address address = addressRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ADDRESS_NOT_FOUND));

        Integer followers = followRepository.countFollowers(userId); // 팔로워 수 조회
        Integer followings = followRepository.countFollowings(userId); // 팔로잉 수 조회
        Integer totalRatings = ratingRepository.countRatings(userId);
        Integer totalReviews = reviewRepository.countReviews(userId);

        return UserInfoResponse.of(user, address, followers, followings, totalRatings, totalReviews);
    }

    public UserMypageResponse getUserMypage(Integer userId, Integer targetUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Integer followers = followRepository.countFollowers(targetUserId); // 팔로워 수 조회
        Integer followings = followRepository.countFollowings(targetUserId); // 팔로잉 수 조회
        Integer totalRatings = ratingRepository.countRatings(targetUserId);
        Integer totalReviews = reviewRepository.countReviews(targetUserId);

        Boolean isFollowing = followRepository.existsByFollowerIdAndFollowingId(user.getId(), targetUserId);

        return UserMypageResponse.of(targetUser, followers, followings, totalRatings, totalReviews, isFollowing);
    }

    // 프로필 이미지 등록, 수정, 삭제
    @Transactional
    public void saveProfileImage(Integer userId, UserUpdateImgRequest dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String defaultImageUrl = "https://res.cloudinary.com/gominsushi/image/upload/v1743145995/bird_xbfc1j.png";  // 기본 이미지 URL

        String imgUrl = (dto.getImgurl() == null || dto.getImgurl().isBlank())
                ? defaultImageUrl
                : dto.getImgurl();

        user.updatedProfileUrl(imgUrl);
    }
}
