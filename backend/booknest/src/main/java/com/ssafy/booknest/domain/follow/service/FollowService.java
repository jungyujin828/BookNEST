package com.ssafy.booknest.domain.follow.service;

import com.ssafy.booknest.domain.follow.entity.Follow;
import com.ssafy.booknest.domain.follow.repository.FollowRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

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
}
