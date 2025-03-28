package com.ssafy.booknest.domain.book.repository;

import com.ssafy.booknest.domain.book.entity.Ebook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ebookRepository extends JpaRepository<Ebook, Integer> {

    List<Ebook> findByCityAndDistrict(String city, String district);
}
