package com.ssafy.booknest.domain.follow.service;

import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.follow.dto.response.FollowResponse;
import com.ssafy.booknest.domain.follow.entity.Follow;
import com.ssafy.booknest.domain.follow.repository.FollowRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;

    @Transactional
    public void followUser(Integer userId, Integer targetUserId) {
        User follower = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        User following = userRepository.findById(targetUserId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();
        followRepository.save(follow);
    }

    @Transactional
    public void unfollowUser(Integer userId, Integer targetUserId) {
        User follower = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        User following = userRepository.findById(targetUserId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        followRepository.deleteByFollowerAndFollowing(follower, following);
    }

    public CustomPage<FollowResponse> getFollowingList(Integer userId, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Page<User> followingUsers = followRepository.findFollowingUsers(userId, pageable);

        return new CustomPage<>(followingUsers.map(followingUser -> {
            Integer totalRatings = ratingRepository.countRatings(followingUser.getId());
            return FollowResponse.of(followingUser, totalRatings);
        }));
    }

    public CustomPage<FollowResponse> getFollowerList(Integer userId, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Page<User> followerUsers = followRepository.findFollwerUsers(userId, pageable);

        return new CustomPage<>(followerUsers.map(followingUser -> {
            Integer totalRatings = ratingRepository.countRatings(followingUser.getId());
            return FollowResponse.of(followingUser, totalRatings);
        }));
    }
}
