package com.ssafy.booknest.domain.user.repository.category;

import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.category.UserCategoryRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCategoryRecommendationRepository extends JpaRepository<UserCategoryRecommendation, Integer> {

    List<UserCategoryRecommendation> findByUserId(Integer userId);

}
