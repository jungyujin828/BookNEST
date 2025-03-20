package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.entity.BestSeller;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // 베스트셀러 조회 (BestSeller → Book → BookResponse 변환)
    public List<BookResponse> getBestSellers() {
        try {
            List<BestSeller> bestSellers = bookRepository.findBestSellers();

            if (bestSellers == null || bestSellers.isEmpty()) {
                System.out.println("베스트셀러 목록이 비어 있습니다.");
                return Collections.emptyList();
            }

            return bestSellers.stream()
                    .map(bestSeller -> BookResponse.of(bestSeller.getBook()))
                    .toList();

        } catch (Exception e) {
            System.out.println("베스트셀러 조회 중 오류 발생: " + e.getMessage());
            return Collections.emptyList();
        }
    }


//    // 내 지역에서 가장 많이 읽은 책
//    public List<BookResponse> getMostReadBooksByRegion(Integer userId) {
//        List<Book> MostReadBooksByRegion = bookRepository.findMostReadBooksByRegion();
//
//        return MostReadBooksByRegion.stream()
//                .map(BookResponse::of)
//                .collect(Collectors.toList());
//    }

//    // 내 성별과 나이대에서 많이 읽은 책
//    public List<BookResponse> getMostReadBooksByGenderAndAge(Integer userId) {
//        List<Book> MostReadBooksByGenderAndAge = bookRepository.findMostReadBooksByGenderAndAge();
//
//        return MostReadBooksByGenderAndAge.stream()
//                .map(BookResponse::of)
//                .collect(Collectors.toList());
//    }
}
