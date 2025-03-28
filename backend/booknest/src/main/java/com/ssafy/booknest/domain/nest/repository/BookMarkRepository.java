package com.ssafy.booknest.domain.nest.repository;

import com.ssafy.booknest.domain.nest.entity.BookMark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookMarkRepository extends JpaRepository<BookMark, Integer> {
        boolean existsByNestIdAndBookId(Integer id, Integer bookId);

        Optional<BookMark> findByNestIdAndBookId(Integer id, Integer bookId);
    }
