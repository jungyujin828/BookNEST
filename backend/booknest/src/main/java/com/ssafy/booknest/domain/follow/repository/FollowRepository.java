package com.ssafy.booknest.domain.follow.repository;

import com.ssafy.booknest.domain.follow.entity.Follow;
import com.ssafy.booknest.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Integer> {

    void deleteByFollowerAndFollowing(User follower, User following);

    // 특정 사용자를 팔로우하는 사람(팔로워) 수 조회
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.following.id = :userId")
    Integer countFollowers(@Param("userId") Integer userId);

    // 특정 사용자가 팔로우하는 사람(팔로잉) 수 조회
    @Query("SELECT COUNT(f) FROM Follow f WHERE f.follower.id = :userId")
    Integer countFollowings(@Param("userId") Integer userId);
}
