package com.ssafy.booknest.domain.user.repository.tag;

import com.ssafy.booknest.domain.user.entity.tag.UserTagRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTagRecommendationRepository extends JpaRepository<UserTagRecommendation, Integer> {
}
