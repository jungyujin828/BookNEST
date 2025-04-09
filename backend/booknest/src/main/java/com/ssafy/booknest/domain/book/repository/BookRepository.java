package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.BestSeller;
import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.entity.CriticBook;
import jakarta.persistence.QueryHint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    // 베스트 셀러
    @Query(value = "SELECT * FROM best_seller LIMIT 15", nativeQuery = true)
    List<BestSeller> findBestSellers();

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

    // 화제의 작가 최상위 3명의 책 가져오기
    @Query("""
        SELECT b FROM Book b
        JOIN b.bookAuthors ba
        JOIN ba.author a
        WHERE a.name LIKE %:author%
        ORDER BY b.createdAt DESC
    """)
    List<Book> findBooksByAuthorNameLike(@Param("author") String author, Pageable pageable);



    @Query("""
    SELECT b 
    FROM Book b 
    WHERE b.id NOT IN :excludedIds AND
          (SELECT COUNT(r) FROM Rating r WHERE r.book = b) > 0
    ORDER BY (SELECT COUNT(r) FROM Rating r WHERE r.book = b) DESC
    """)
    Page<Book> findMostRatedBooksExcluding(@Param("excludedIds") List<Integer> excludedIds, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.id NOT IN :excludedIds ORDER BY b.publishedDate DESC")
    Page<Book> findRecentBooksExcluding(@Param("excludedIds") List<Integer> excludedIds, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.id NOT IN :excludedIds ORDER BY function('RAND')")
    Page<Book> findRandomBooksExcluding(@Param("excludedIds") List<Integer> excludedIds, Pageable pageable);


    // 주어진 태그를 가진 도서들 중 무작위로 선택하여 일정 개수만 조회 (태그별 인기 도서 부족 시 대체용)
    @Query("SELECT DISTINCT b FROM Book b JOIN b.bookTags bt WHERE bt.tag.name = :tag ORDER BY function('RAND')")
    List<Book> findRandomBooksByTag(@Param("tag") String tag, Pageable pageable);



    // 특정 태그를 가진 책에서 해당 유저가 평가하지 않은 책
    @Query("""
    SELECT b.id
    FROM Book b
    JOIN b.bookTags bt
    JOIN bt.tag t
    WHERE t.name = :tagName
      AND b.id NOT IN :excludedIds
""")
    List<Integer> findBookIdsByTagNameExcluding(
            @Param("tagName") String tagName,
            @Param("excludedIds") List<Integer> excludedIds
    );



    // 특정 카테고리를 가진 책에서 해당 유저가 평가하지 않은 책
    @Query("""
        SELECT b.id
        FROM Book b
        JOIN b.bookCategories bc
        JOIN bc.category c
        WHERE c.name = :categoryName
        AND b.id NOT IN :excludedIds
     """)
    List<Integer> findBookIdsByCategoryNameExcluding(
            @Param("categoryName") String categoryName,
            @Param("excludedIds") List<Integer> excludedIds
    );






}