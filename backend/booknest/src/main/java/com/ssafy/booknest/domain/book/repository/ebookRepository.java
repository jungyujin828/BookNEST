package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Ebook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ebookRepository extends JpaRepository<Ebook, Integer> {

    List<Ebook> findByCityAndDistrict(String city, String district);
}
