package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.response.BookDetailResponse;
import com.ssafy.booknest.domain.book.dto.response.BookPurchaseResponse;
import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.entity.BestSeller;
import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.entity.Ebook;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.ebookRepository;
import com.ssafy.booknest.domain.user.entity.Address;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ebookRepository ebookRepository;

    // 베스트셀러 조회 (BestSeller → Book → BookResponse 변환)
    @Transactional(readOnly = true) // LazyInitializationException 방지
    public List<BookResponse> getBestSellers(Integer userId) {
        if (userId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        List<BestSeller> bestSellers = bookRepository.findBestSellers();


        return bestSellers.stream()
                .map(bestSeller -> BookResponse.of(bestSeller.getBook()))
                .toList();
    }


    // 책 상세 페이지 조회
    @Transactional(readOnly = true)
    public BookDetailResponse getBook(Integer userId, Integer bookId) {

        if (userId == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findBookDetailById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        Double averageRating = bookRepository.findAverageRatingByBookId(bookId).orElse(0.0);

        return BookDetailResponse.of(book, averageRating);
    }

    // 구매 사이트 조회
    @Transactional(readOnly = true)
    public BookPurchaseResponse getPurchaseLinks(int userId, int bookId) {

        // 책 상세 정보 조회
        Book book = bookRepository.findBookDetailById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        // 책 제목과 ISBN
        String title = book.getTitle();
        String encodedTitle = URLEncoder.encode(title, StandardCharsets.UTF_8);

        // 구매 사이트 링크 생성
        return BookPurchaseResponse.builder()
                .aladinUrl("https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&SearchWord=" + encodedTitle)
                .kyoboUrl("https://search.kyobobook.co.kr/web/search?vPstrKeyWord=" + encodedTitle)
                .yes24Url("https://www.yes24.com/Product/Search?domain=ALL&query=" + encodedTitle)
                .build();
    }

    // 온라인 무료 도서관 추천
    public List<String> getOnlineLibrary(Integer userId, Integer bookId) {

        Book book = bookRepository.findBookDetailById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Address address = user.getAddress();
        if (address == null) {
            throw new CustomException(ErrorCode.ADDRESS_NOT_FOUND);
        }

        // 주소 정보에서 city, district 추출
        String city = address.getCity();
        String district = address.getDistrict();

        // 해당 지역의 ebook 리스트 가져오기
        List<Ebook> ebooks = ebookRepository.findByCityAndDistrict(city, district);

        // redirectUrl만 뽑아서 반환
        return ebooks.stream()
                .map(Ebook::getRedirectUrl)
                .collect(Collectors.toList());
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
