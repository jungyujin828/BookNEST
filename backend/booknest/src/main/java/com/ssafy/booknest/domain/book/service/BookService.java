package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.response.BookDetailResponse;
import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.entity.BestSeller;
import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // 베스트셀러 조회 (BestSeller → Book → BookResponse 변환)
    @Transactional(readOnly = true) // LazyInitializationException 방지
    public List<BookResponse> getBestSellers() {
        List<BestSeller> bestSellers = bookRepository.findBestSellers();

        // 베스트셀러가 없으면 예외 발생
        if (bestSellers.isEmpty()) {
            throw new CustomException(ErrorCode.BOOK_NOT_FOUND);
        }

        return bestSellers.stream()
                .map(bestSeller -> BookResponse.of(bestSeller.getBook()))
                .toList();
    }


    // 책 상세 페이지 조회
    @Transactional(readOnly = true)
    public BookDetailResponse getBook(int bookId) {

        Book book = bookRepository.findBookDetailById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        // 평균 평점 조회 (없으면 0.0 반환)
        Double averageRating = bookRepository.findAverageRatingByBookId(bookId).orElse(0.0);


        return BookDetailResponse.of(book, averageRating);
    }


//    // 내 지역에서 가장 많이 읽은 책
//    public List<BookResponse> getMostReadBooksByRegion() {
//        List<Book> mostReadBooksByRegion = bookRepository.findMostReadBooksByRegion();
//
//        if (mostReadBooksByRegion.isEmpty()) {
//            throw new CustomException(ErrorCode.BOOK_NOT_FOUND);
//        }
//
//        return mostReadBooksByRegion.stream()
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
