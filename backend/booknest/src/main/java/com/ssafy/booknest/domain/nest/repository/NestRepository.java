package com.ssafy.booknest.domain.nest.repository;

import com.ssafy.booknest.domain.nest.entity.Nest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NestRepository extends JpaRepository<Nest, Integer> {

}
