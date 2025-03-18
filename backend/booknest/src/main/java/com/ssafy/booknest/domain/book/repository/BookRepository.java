package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

//    // 베스트 셀러
//    List<Book> findBestSellers();
//
//    // 내 지역에서 가장 많이 읽은 책
//    List<Book> findMostReadBooksByRegion();
//
//    // 내 성별과 나이대에서 가장 많이 읽은 책
//    List<Book> findMostReadBooksByGenderAndAge();
}
