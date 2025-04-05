package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.PopularAuthorBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PopularAuthorBookRepository extends JpaRepository<PopularAuthorBook, Integer> {

    @Query("SELECT p FROM PopularAuthorBook p JOIN FETCH p.book b LEFT JOIN FETCH b.bookAuthors ba LEFT JOIN FETCH ba.author")
    List<PopularAuthorBook> findAllWithBookAndAuthor();

}
