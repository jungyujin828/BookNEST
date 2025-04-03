package com.ssafy.booknest.domain.nest.repository;

import com.ssafy.booknest.domain.nest.entity.BookMark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookMarkRepository extends JpaRepository<BookMark, Integer> {
    boolean existsByNestIdAndBookId(Integer id, Integer bookId);

    @Query("SELECT COUNT(bm) > 0 FROM BookMark bm " +
            "WHERE bm.book.id = :bookId AND bm.nest.id IN " +
            "(SELECT n.id FROM Nest n WHERE n.user.id = :userId)")
    boolean existsByBookIdAndUserId(@Param("bookId") Integer bookId, @Param("userId") Integer userId);

    Optional<BookMark> findByNestIdAndBookId(Integer id, Integer bookId);
    }
