package com.ssafy.booknest.domain.user.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.UserTagAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserTagAnalysisRepository extends JpaRepository<UserTagAnalysis, Integer> {

    Optional<UserTagAnalysis> findByUser(User user);

}
