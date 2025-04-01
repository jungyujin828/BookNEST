package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.entity.IgnoredBook;
import com.ssafy.booknest.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IgnoredBookRepository extends JpaRepository<IgnoredBook, Integer> {

    // 이미 유저가 해당 책을 관심없음을 표시했는지
    boolean existsByUserAndBook(User user, Book book);
}
