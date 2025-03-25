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
public interface BookRepository extends JpaRepository<Book, Long> {

    // 베스트 셀러
    @Query("SELECT bs FROM BestSeller bs")
    List<BestSeller> findBestSellers();

    // bookId로 책을 조회하는 메서드
    Optional<Book> findBookDetailById(Integer bookId);

    // 책 평균 평가 점수 구하기
    @Query("SELECT ROUND(AVG(r.rating), 2) FROM Rating r WHERE r.book.id = :bookId")
    Optional<Double> findAverageRatingByBookId(@Param("bookId") int bookId);

//    // 책 제목 기반 검색
//    @EntityGraph(attributePaths = {"bookAuthors", "bookAuthors.author"})
//    Page<Book> findByTitleContaining(String keyword, Pageable pageable);

//    // 책 저자 기반 검색
//    @Query("SELECT DISTINCT b FROM Book b " +
//            "JOIN FETCH b.bookAuthors ba " +
//            "JOIN FETCH ba.author a " +
//            "WHERE a.name LIKE %:keyword%")
//    Page<Book> findByAuthorNameContaining(@Param("keyword") String keyword, Pageable pageable);

//    // 책 + 저자 기반 검색
//    @Query(
//            value = "SELECT DISTINCT b FROM Book b " +
//                    "LEFT JOIN FETCH b.bookAuthors ba " +
//                    "LEFT JOIN FETCH ba.author a " +
//                    "WHERE b.title LIKE %:keyword% OR a.name LIKE %:keyword%",
//            countQuery = "SELECT COUNT(DISTINCT b) FROM Book b " +
//                    "LEFT JOIN b.bookAuthors ba " +
//                    "LEFT JOIN ba.author a " +
//                    "WHERE b.title LIKE %:keyword% OR a.name LIKE %:keyword%"
//    )
//    Page<Book> findByTitleOrAuthorContaining(@Param("keyword") String keyword, Pageable pageable);



//    // 내 지역에서 가장 많이 읽은 책
//    List<Book> findMostReadBooksByRegion();
//
//    // 내 성별과 나이대에서 가장 많이 읽은 책
//    List<Book> findMostReadBooksByGenderAndAge();

}
