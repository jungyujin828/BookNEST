package com.ssafy.booknest.domain.follow.repository;

import com.ssafy.booknest.domain.follow.entity.Follow;
import com.ssafy.booknest.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Integer> {

    void deleteByFollowerAndFollowing(User follower, User following);
}
