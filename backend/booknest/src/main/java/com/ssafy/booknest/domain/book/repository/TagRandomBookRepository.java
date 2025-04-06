package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.TagRandomBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRandomBookRepository extends JpaRepository<TagRandomBook,Integer> {

    // 랜덤으로 태그 추출
    @Query(value = "SELECT tag FROM tag_random_book GROUP BY tag ORDER BY RAND() LIMIT 1", nativeQuery = true)
    String findRandomTag();

    // 랜덤으로 추출된 태그로 해당 도서 목록 조회
    List<TagRandomBook> findByTag(String selectedTag);
}
