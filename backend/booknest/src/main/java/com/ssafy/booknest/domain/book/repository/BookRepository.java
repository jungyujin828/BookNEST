package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // 베스트 셀러
    @Query("SELECT bs.book FROM BestSeller bs")
    List<Book> findBestSellers();

//    // 내 지역에서 가장 많이 읽은 책
//    List<Book> findMostReadBooksByRegion();
//
//    // 내 성별과 나이대에서 가장 많이 읽은 책
//    List<Book> findMostReadBooksByGenderAndAge();
//
//    // 화제의 작가의 책
//    List<Book> findBooksByPopularAuthor();
//
//    // 평론가 추천 책
//    List<Book> findBooksByCritic();
//
//    // 가장 최근에 평점 준 작가의 책 추천
//    List<Book> findBooksByAuthorRating(@Param("userId") Integer userId);
}
