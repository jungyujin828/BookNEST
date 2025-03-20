package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.BestSeller;
import com.ssafy.booknest.domain.book.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // 베스트 셀러
    @Query("SELECT bs FROM BestSeller bs")
    List<BestSeller> findBestSellers();


//    // 내 지역에서 가장 많이 읽은 책
//    List<Book> findMostReadBooksByRegion();
//
//    // 내 성별과 나이대에서 가장 많이 읽은 책
//    List<Book> findMostReadBooksByGenderAndAge();
}
