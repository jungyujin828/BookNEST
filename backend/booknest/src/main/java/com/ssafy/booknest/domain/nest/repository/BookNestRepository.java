package com.ssafy.booknest.domain.nest.repository;

import com.ssafy.booknest.domain.nest.entity.BookNest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookNestRepository extends JpaRepository<BookNest, Integer> {

    @Query("SELECT bn FROM BookNest bn WHERE bn.nest.id = :nestId ORDER BY bn.createdAt DESC")
    Page<BookNest> findByNestIdSorted(@Param("nestId") Integer nestId, Pageable pageable);

    Optional<BookNest> findByNestIdAndBookId(Integer id, Integer id1);
}