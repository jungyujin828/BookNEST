package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.recommendation.PopularAuthorBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PopularAuthorBookRepository extends JpaRepository<PopularAuthorBook, Integer> {

    @Query("SELECT p FROM PopularAuthorBook p ORDER BY p.rank ASC")
    Page<PopularAuthorBook> findTopRankedAuthors(Pageable pageable);


}
