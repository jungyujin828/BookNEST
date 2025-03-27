package com.ssafy.booknest.domain.follow.controller;

import com.ssafy.booknest.domain.follow.dto.request.FollowRequest;
import com.ssafy.booknest.domain.follow.service.FollowService;
import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.common.util.AuthenticationUtil;
import com.ssafy.booknest.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/follow")
public class FollowController {

    private final FollowService followService;
    private final AuthenticationUtil authenticationUtil;

    @PostMapping("")
    public ResponseEntity<ApiResponse<Void>> followUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody FollowRequest request){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        followService.followUser(userId, request);

        return ApiResponse.success(HttpStatus.OK);
    }

    @PostMapping("/unfollow")
    public ResponseEntity<ApiResponse<Void>> unfollowUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody FollowRequest request){
        Integer userId = authenticationUtil.getCurrentUserId(userPrincipal);
        followService.unfollowUser(userId, request);

        return ApiResponse.success(HttpStatus.OK);
    }

}
