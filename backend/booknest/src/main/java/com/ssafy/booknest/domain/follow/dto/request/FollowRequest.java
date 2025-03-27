package com.ssafy.booknest.domain.follow.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FollowRequest {
    @NotNull
    private Integer followerId;
    @NotNull
    private Integer followingId;
}
