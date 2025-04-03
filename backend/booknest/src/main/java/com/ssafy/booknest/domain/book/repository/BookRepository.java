package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.BestSeller;
import com.ssafy.booknest.domain.book.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    // 베스트 셀러
    @Query(value = "SELECT * FROM best_seller LIMIT 15", nativeQuery = true)
    List<BestSeller> findBestSellers();

//    // bookId로 책을 조회하는 메서드
//    Optional<Book> findBookDetailById(Integer bookId);

    // 책 평균 평가 점수 구하기
    @Query("SELECT ROUND(AVG(r.rating), 2) FROM Rating r WHERE r.book.id = :bookId")
    Optional<Double> findAverageRatingByBookId(@Param("bookId") int bookId);

    @Query("""
    SELECT b FROM Book b
    LEFT JOIN FETCH b.reviews r
    LEFT JOIN FETCH r.user
    WHERE b.id = :bookId
""")
    Optional<Book> findBookDetailById(@Param("bookId") Integer bookId);

}
