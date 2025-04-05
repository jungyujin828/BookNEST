package com.ssafy.booknest.domain.nest.repository;

import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.nest.entity.BookNest;
import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NestRepository extends JpaRepository<Nest, Integer> {

    @Query("SELECT bn.book FROM BookNest bn WHERE bn.nest.id = :nestId")
    Page<Book> findBooksByNestId(@Param("nestId") Integer nestId, Pageable pageable);

    Optional<Nest> findByUser(User user);

    @Query("""
    SELECT DISTINCT n FROM Nest n
    JOIN FETCH n.bookNests bn
    JOIN FETCH bn.book b
    """)
    List<Nest> findAllWithBooksOnly();

}
