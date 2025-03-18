package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // 베스트 셀러 추천
    public List<BookResponse> findBestSellers() {
        List<Book> bestSellerBooks = bookRepository.findBestSellers();

        if(bestSellerBooks.isEmpty()) {
            throw new CustomException(ErrorCode.BOOK_NOT_FOUND);
        }

        return bestSellerBooks.stream()
                .map(BookResponse::of)
                .collect(Collectors.toList());
    }

//    public SushiOnRailResponse getRailSushi(Integer userId, Integer sushiId) {
//        //초밥 조회
//        Sushi sushi = getSushiById(sushiId);
//
//        if (answerRepository.existsAnswerByUserIdAndSushiId(userId, sushi.getId())) {
//            throw new CustomException(ErrorCode.ALREADY_ANSWERED);
//        }
//
//        //노출시간 갱신
//        updateSushiExposure(userId, sushi);
//        return SushiOnRailResponse.of(sushi);
//    }




//    // 내 지역에서 가장 많이 읽은 책 추천
//    public List<BookResponse> findMostReadBooksByRegion(Integer userId) {
//        List<Book> mostReadBooksByRegion = bookRepository.findMostReadBooksByRegion();
//
//        return mostReadBooksByRegion.stream()
//                .map(BookResponse::of)
//                .collect(Collectors.toList());
//    }
//
//    // 내 성별과 나이대에서 많이 읽은 책 추천
//    public List<BookResponse> findMostReadBooksByGenderAndAge(Integer userId) {
//        List<Book> mostReadBooksByGenderAndAge = bookRepository.findMostReadBooksByGenderAndAge();
//
//        return mostReadBooksByGenderAndAge.stream()
//                .map(BookResponse::of)
//                .collect(Collectors.toList());
//    }
//
//    // 화제의 작가의 책 추천
//    public List<BookResponse> findBooksByPopularAuthor(Integer userId) {
//        List<Book> booksByPopularAuthor = bookRepository.findBooksByPopularAuthor();
//
//        return booksByPopularAuthor.stream()
//                .map(BookResponse::of)
//                .collect(Collectors.toList());
//    }
//
//    // 평론가 추천
//    public List<BookResponse> findBooksByCritic(Integer userId) {
//        List<Book> booksByCritic = bookRepository.findBooksByCritic();
//
//        return booksByCritic.stream()
//                .map(BookResponse::of)
//                .collect(Collectors.toList());
//    }
//
//    // 가장 최근에 평점 준 작가의 책 추천
//    public List<BookResponse> findBooksByAuthorRating(Integer userId) {
//        List<Book> booksByAuthorRating = bookRepository.findBooksByAuthorRating(userId);
//
//        return booksByAuthorRating.stream()
//                .map(BookResponse::of)
//                .collect(Collectors.toList());
//    }

}
