package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.response.*;
import com.ssafy.booknest.domain.book.dto.response.BookDetailResponse;
import com.ssafy.booknest.domain.book.dto.response.BookPurchaseResponse;
import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.dto.response.ReviewResponse;
import com.ssafy.booknest.domain.book.entity.*;
import com.ssafy.booknest.domain.book.enums.AgeGroup;
import com.ssafy.booknest.domain.book.enums.BookSearchType;
import com.ssafy.booknest.domain.book.repository.*;
import com.ssafy.booknest.domain.nest.entity.BookMark;
import com.ssafy.booknest.domain.nest.entity.BookNest;
import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.domain.book.enums.BookEvalType;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.nest.repository.BookMarkRepository;
import com.ssafy.booknest.domain.nest.repository.BookNestRepository;
import com.ssafy.booknest.domain.nest.repository.NestRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.enums.Gender;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BookMarkRepository bookMarkRepository;
    private final KyoboService kyoboService;
    private final Yes24Service yes24Service;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final RatingRepository ratingRepository;
    private final CriticBookRepository criticBookRepository;
    private final PopularAuthorBookRepository popularAuthorBookRepository;
    private final BookNestRepository bookNestRepository;
    private final NestRepository nestRepository;
    private final AgeGenderBookRepository ageGenderBookRepository;
    private final TagRandomBookRepository tagRandomBookRepository;
    private final LibraryBookRepository libraryBookRepository;


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
    public BookDetailResponse getBook(Integer userId, Integer bookId, Pageable pageable) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));

        Double avgRating = bookRepository.findAverageRatingByBookId(bookId)
                .orElse(0.0);

        Page<Review> reviewPage = reviewRepository.findByBookOrderByUserFirst(book, userId, pageable);

        Page<ReviewResponse> responsePage = reviewPage.map(review -> ReviewResponse.of(review, userId));
        boolean isBookMarked = bookMarkRepository.existsByBookIdAndUserId(book.getId(), userId);

        return BookDetailResponse.of(book, avgRating, userId, responsePage, isBookMarked);
    }

    // 구매 사이트 조회
    @Transactional(readOnly = true)
    public BookPurchaseResponse getPurchaseLinks(Integer bookId) {

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


    // 평론가 추천책
    public List<CriticBookResponse> getCriticBooks(Integer userId) {
        List<String> criticNames = criticBookRepository.findAllCriticNames();

        if (criticNames.isEmpty()) {
            throw new CustomException(ErrorCode.CRITIC_NOT_FOUND);
        }

        String selectedCritic = criticNames.get(new Random().nextInt(criticNames.size()));

        List<CriticBook> criticBooks =
                criticBookRepository.findByCriticNameWithBookAndAuthors(selectedCritic);

        if (criticBooks.isEmpty()) {
            throw new CustomException(ErrorCode.CRITIC_BOOK_NOT_FOUND);
        }

        return criticBooks.stream()
                .map(CriticBookResponse::of)
                .toList();
    }



    // 화제의 작가 추천 책
    @Transactional(readOnly = true)
    public List<BookResponse> getAuthorBooks(Integer userId) {
        List<PopularAuthorBook> popularBooks = popularAuthorBookRepository.findAllWithBookAndAuthor();

        return popularBooks.stream()
                .map(popular -> BookResponse.of(popular.getBook()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomPage<BookResponse> getEvalBookList(Integer userId, BookEvalType keyword, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<Integer> evaluatedBookIds = ratingRepository.findBookIdsByUserId(userId);

        if (evaluatedBookIds == null || evaluatedBookIds.isEmpty()) {
            evaluatedBookIds = List.of(-1);
        }

        Page<Book> books;

        switch (keyword) {
            case POPULAR:
                books = bookRepository.findMostRatedBooksExcluding(evaluatedBookIds, pageable);
                break;
            case RECENT:
                books = bookRepository.findRecentBooksExcluding(evaluatedBookIds, pageable);
                break;
            case RANDOM:
            default:
                books = bookRepository.findRandomBooksExcluding(evaluatedBookIds, pageable);
                break;
        }

        // Book -> BookResponse 변환 및 CustomPage 래핑
        Page<BookResponse> bookResponses = books.map(BookResponse::of);
        return new CustomPage<>(bookResponses);
    }

    // 나이대와 성별에 따른 추천
    @Transactional(readOnly = true)
    public List<AgeGenderBookResponse> getAgeGenderBooks(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        AgeGroup ageGroup = null;
        Gender gender = user.getGender();

        // 생년월일 → 나이대 계산 (이상하면 무시)
        String birthdateStr = user.getBirthdate();
        if (birthdateStr != null && birthdateStr.length() >= 4) {
            try {
                int birthYear = Integer.parseInt(birthdateStr.substring(0, 4));
                int age = LocalDate.now().getYear() - birthYear + 1;
                ageGroup = AgeGroup.fromAge(age);
            } catch (NumberFormatException ignored) {
                // 잘못된 생년월일 형식이면 조용히 ageGroup = null 유지
            }
        }


        List<AgeGenderBook> books = new ArrayList<>();

        // 1. 나이대 + 성별
        if (ageGroup != null && gender != null && gender != Gender.N && gender != Gender.O) {
            books = ageGenderBookRepository.findByAgeGroupAndGender(ageGroup, gender);
        }

        // 2. 나이대만
        if (books.isEmpty() && ageGroup != null) {
            books = ageGenderBookRepository.findByAgeGroup(ageGroup);
        }

        // 3. 성별만
        if (books.isEmpty() && gender != null && gender != Gender.N && gender != Gender.O) {
            books = ageGenderBookRepository.findByGender(gender);
        }

        // 4. 랜덤 fallback
        if (books.isEmpty()) {
            books = ageGenderBookRepository.findRandomLimit(15);
        }

        return books.stream()
                .limit(15)
                .map(AgeGenderBookResponse::of)
                .toList();
    }

    // 태그별 랜덤 추천
    @Transactional(readOnly = true)
    public List<TagBookResponse> getTagRandomBooks(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 랜덤 태그 하나만 DB에서 가져오기
        String selectedTag = tagRandomBookRepository.findRandomTag();

        if (selectedTag == null) return List.of(); // 태그가 없을 경우

        // 해당 태그의 책 가져오기
        List<TagRandomBook> tagBooks = tagRandomBookRepository.findByTag(selectedTag);

        return tagBooks.stream()
                .map(tagBook -> TagBookResponse.of(tagBook.getBook(), selectedTag))
                .limit(15)
                .toList();
    }

    // 년도별 도서관 대여 순위 추천
    @Transactional(readOnly = true)
    public List<LibraryBookResponse> getLibraryBooksByYear(Integer targetYear) {
        List<LibraryBook> books = libraryBookRepository.findTopByYearOrderByRank(targetYear);

        return books.stream()
                .map(LibraryBookResponse::of)
                .collect(Collectors.toList());
    }



//    // 온라인 무료 도서관 추천(이거 좀 나중에 다시)
//    public List<String> getOnlineLibrary(Integer userId, Integer bookId) {
//
//        Book book = bookRepository.findBookDetailById(bookId)
//                .orElseThrow(() -> new CustomException(ErrorCode.BOOK_NOT_FOUND));
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
//
//        Address address = user.getAddress();
//        if (address == null) {
//            throw new CustomException(ErrorCode.ADDRESS_NOT_FOUND);
//        }
//
//        // 주소 정보에서 city, district 추출
//        String city = address.getCity();
//        String district = address.getDistrict();
//
//        // 해당 지역의 ebook 리스트 가져오기
//        List<Ebook> ebooks = ebookRepository.findByCityAndDistrict(city, district);
//
//        // redirectUrl만 뽑아서 반환
//        return ebooks.stream()
//                .map(Ebook::getRedirectUrl)
//                .collect(Collectors.toList());
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
