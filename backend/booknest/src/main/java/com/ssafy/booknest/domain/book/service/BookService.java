package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.request.ReviewRequestDto;
import com.ssafy.booknest.domain.book.dto.response.BookDetailResponse;
import com.ssafy.booknest.domain.book.dto.response.BookPurchaseResponse;
import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.dto.response.BookSearchResponse;
import com.ssafy.booknest.domain.book.entity.*;
import com.ssafy.booknest.domain.book.enums.BookSearchType;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.book.repository.ebookRepository;
import com.ssafy.booknest.domain.user.entity.Address;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ebookRepository ebookRepository;
    private final KyoboService kyoboService;
    private final Yes24Service yes24Service;
    private final ReviewRepository reviewRepository;
    private final RatingRepository ratingRepository;

    // 베스트셀러 조회 (BestSeller → Book → BookResponse 변환)
    @Transactional(readOnly = true) // LazyInitializationException 방지
    public List<BookResponse> getBestSellers() {

        List<BestSeller> bestSellers = bookRepository.findBestSellers();


        return bestSellers.stream()
                .map(bestSeller -> BookResponse.of(bestSeller.getBook()))
                .toList();
    }


    // 책 상세 페이지 조회
    @Transactional(readOnly = true)
    public BookDetailResponse getBook(Integer userId, Integer bookId) {

        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findBookDetailById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        Double averageRating = bookRepository.findAverageRatingByBookId(bookId).orElse(0.0);

        return BookDetailResponse.of(book, averageRating);
    }




    // 구매 사이트 조회
    @Transactional(readOnly = true)
    public BookPurchaseResponse getPurchaseLinks(int bookId) {

        Book book = bookRepository.findBookDetailById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        // ISBN 인코딩 (혹시 모를 공백, 특수문자 없애고 순수 숫자 추출을 위해 인코딩)
        String isbn = book.getIsbn();
        String encodedIsbn = URLEncoder.encode(isbn, StandardCharsets.UTF_8);

        // 알라딘: ISBN 기반
        String aladinUrl = "https://www.aladin.co.kr/shop/wproduct.aspx?ISBN=" + encodedIsbn;

        // 교보문고: ISBN 기반 크롤링
        String kyoboUrl = kyoboService.getKyoboUrlByIsbn(isbn);

        // YES24: ISBN 기반 크롤링
        String yes24Url = yes24Service.getYes24UrlByIsbn(isbn);


        return BookPurchaseResponse.builder()
                .aladinUrl(aladinUrl)
                .kyoboUrl(kyoboUrl)
                .yes24Url(yes24Url)
                .build();
    }

    // 한줄평 등록
    @Transactional
    public void saveReview(Integer userId, Integer bookId, ReviewRequestDto dto) {
        // 1. 입력값 검증 (Fail-Fast)
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new CustomException(ErrorCode.EMPTY_REVIEW_CONTENT);
        }

        // 2. 중복 체크
        if (reviewRepository.existsByUserIdAndBookId(userId, bookId)) {
            throw new CustomException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        // 3. 필수 객체 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        // 4. 평점이 있으면 포함해서 빌더에 설정
        Optional<Rating> ratingOptional = ratingRepository.getRatingByUserIdAndBookId(userId, bookId);

        Review review = Review.builder()
                .user(user)
                .book(book)
                .content(dto.getContent())
                .rating(ratingOptional.map(Rating::getRating).orElse(null)) // 평점이 없으면 null
                .createdAt(LocalDateTime.now())
                .build();

        reviewRepository.save(review);
    }



    // 한줄평 수정
    @Transactional
    public void updateReview(Integer userId, Integer bookId, ReviewRequestDto dto) {
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new CustomException(ErrorCode.EMPTY_REVIEW_CONTENT);
        }

        Review review = reviewRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        review.updateContent(dto.getContent());
    }

    // 한줄평 삭제
    @Transactional
    public void deleteReview(Integer userId, Integer bookId) {
        Review review = reviewRepository.findByUserIdAndBookId(userId, bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN_ACCESS);
        }

        reviewRepository.delete(review);
    }





    // 온라인 무료 도서관 추천(이거 좀 나중에 다시)
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




//    // 제목, 저자 기반 검색 (나중에 다시)
//    public BookSearchResponse searchBooks(String keyword, BookSearchType type, int userPage, int size) {
//        validateKeyword(keyword);
//
//        int internalPage = Math.max(userPage - 1, 0); // 내부 페이지 계산
//
//        Pageable pageable = PageRequest.of(internalPage, size);
//        Page<Book> books;
//
//        switch (type) {
//            case TITLE -> books = bookRepository.findByTitleContaining(keyword, pageable);
//            case AUTHOR -> books = bookRepository.findByAuthorNameContaining(keyword, pageable);
//            case ALL -> books = bookRepository.findByTitleOrAuthorContaining(keyword, pageable);
//            default -> throw new CustomException(ErrorCode.UNSUPPORTED_SEARCH_TYPE);
//        }
//
//        Page<BookResponse> resultPage = books.map(BookResponse::of);
//
//        return BookSearchResponse.of(resultPage, userPage, BookSearchType.valueOf(type.name()));
//    }
//
//    // 검색 유효성 검사
//    private void validateKeyword(String keyword) {
//        if (keyword == null || keyword.trim().isEmpty()) {
//            throw new CustomException(ErrorCode.EMPTY_KEYWORD);
//        }
//    }






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
