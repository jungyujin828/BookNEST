package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.domain.book.dto.response.*;
import com.ssafy.booknest.domain.book.dto.response.BookDetailResponse;
import com.ssafy.booknest.domain.book.dto.response.BookPurchaseResponse;
import com.ssafy.booknest.domain.book.dto.response.BookResponse;
import com.ssafy.booknest.domain.book.dto.response.ReviewResponse;
import com.ssafy.booknest.domain.book.entity.*;
import com.ssafy.booknest.domain.book.enums.AgeGroup;
import com.ssafy.booknest.domain.book.repository.*;
import com.ssafy.booknest.domain.book.enums.BookEvalType;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.book.repository.ReviewRepository;
import com.ssafy.booknest.domain.nest.repository.BookMarkRepository;
import com.ssafy.booknest.domain.nest.repository.BookNestRepository;
import com.ssafy.booknest.domain.nest.repository.NestRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.UserCategoryAnalysis;
import com.ssafy.booknest.domain.user.entity.UserTagAnalysis;
import com.ssafy.booknest.domain.user.enums.Gender;
import com.ssafy.booknest.domain.user.repository.UserCategoryAnalysisRepository;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.domain.user.repository.UserTagAnalysisRepository;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import jakarta.persistence.Cacheable;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final NestRepository nestRepository;
    private final AgeGenderBookRepository ageGenderBookRepository;
    private final TagRandomBookRepository tagRandomBookRepository;
    private final LibraryBookRepository libraryBookRepository;
    private final UserCategoryAnalysisRepository userCategoryAnalysisRepository;
    private final UserTagAnalysisRepository userTagAnalysisRepository;


    // 베스트셀러 조회 (BestSeller → Book → BookResponse 변환)
    @Transactional(readOnly = true)
    public List<BookResponse> getBestSellers(Integer userId) {

        // 사용자 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<BestSeller> bestSellers = bookRepository.findBestSellers();

        return bestSellers.stream()
                .map(bestSeller -> BookResponse.of(bestSeller.getBook()))
                .toList();
    }

    // 책 상세 페이지 조회
    @Transactional(readOnly = true)
    public BookDetailResponse getBook(Integer userId, Integer bookId, Pageable pageable) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

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
    public BookPurchaseResponse getPurchaseLinks(Integer userId, Integer bookId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

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

        // 사용자 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

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

        // 1. 사용자 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. rank 기준 상위 30개만 조회 (중복 제거 고려)
        Page<PopularAuthorBook> page = popularAuthorBookRepository
                .findTopRankedAuthors(PageRequest.of(0, 30));

        // 3. 중복 책 제거하면서 15권 추출
        List<BookResponse> result = new ArrayList<>();
        Set<Integer> addedBookIds = new HashSet<>();

        for (PopularAuthorBook popular : page.getContent()) {
            Book book = popular.getBook(); // LAZY 로딩
            if (book != null && addedBookIds.add(book.getId())) {
                result.add(BookResponse.of(book));
            }
            if (result.size() == 15) break;
        }

        return result;
    }

    // 평가 목록 조회
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
    public AgeGenderBookResult getAgeGenderBooks(Integer userId) {

        // 사용자 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        AgeGroup ageGroup = null;
        Gender gender = user.getGender();

        // 생년월일 → 나이대 추출
        String birthdateStr = user.getBirthdate();
        if (birthdateStr != null && birthdateStr.length() >= 4) {
            try {
                int birthYear = Integer.parseInt(birthdateStr.substring(0, 4));
                int age = LocalDate.now().getYear() - birthYear + 1;
                ageGroup = AgeGroup.fromAge(age);
            } catch (NumberFormatException ignored) {
            }
        }

        List<AgeGenderBook> books = new ArrayList<>();
        boolean isValidGender = (gender == Gender.M || gender == Gender.F);

        // 1. 나이대 + 성별
        if (ageGroup != null && isValidGender) {
            books = ageGenderBookRepository.findByAgeGroupAndGender(ageGroup, gender);
        }

        // 2. 나이대만
        if (books.isEmpty() && ageGroup != null) {
            books = ageGenderBookRepository.findByAgeGroup(ageGroup);
        }

        // 3. 성별만
        if (books.isEmpty() && isValidGender) {
            books = ageGenderBookRepository.findByGender(gender);
        }

        // 4. 랜덤 fallback
        if (books.isEmpty()) {
            books = ageGenderBookRepository.findRandomLimit(15);
        }

        // 변환
        List<AgeGenderBookResponse> responses = books.stream()
                .limit(15)
                .map(AgeGenderBookResponse::of)
                .toList();

        // 설명 생성 + 결과 반환
        return AgeGenderBookResult.of(userId, responses, userRepository);
    }



    // 태그별 랜덤 추천
    @Transactional(readOnly = true)
    public List<TagBookResponse> getTagRandomBooks(Integer userId) {

        // 사용자 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 태그 목록 가져오기
        List<String> tags = tagRandomBookRepository.findAllTags();
        if (tags.isEmpty()) return List.of();

        // Java에서 랜덤 태그 선택
        String selectedTag = tags.get(new Random().nextInt(tags.size()));

        // 해당 태그에 대해 랜덤 책 15권만 DB에서 가져오기
        List<TagRandomBook> tagBooks = tagRandomBookRepository.findRandomBooksByTag(selectedTag);

        return tagBooks.stream()
                .map(tagBook -> TagBookResponse.of(tagBook.getBook(), selectedTag))
                .toList();
    }


    // 년도별 도서관 대여 순위 추천
    @Transactional(readOnly = true)
    public List<LibraryBookResponse> getLibraryBooksByYear(Integer userId, Integer targetYear) {

        // 사용자 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<LibraryBook> books = libraryBookRepository.findTopByYearOrderByRank(targetYear);

        return books.stream()
                .map(LibraryBookResponse::of)
                .collect(Collectors.toList());
    }

    // 사용자가 많이 본 태그에서 추천
    @Transactional(readOnly = true)
    public List<FavoriteTagBookResponse> getFavoriteTagBooks(Integer userId) {

        // 1. 사용자 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. 선호 태그 리스트 가져오기
        List<String> tags = userTagAnalysisRepository.findTopTagsByUserId(userId);
        if (tags == null || tags.isEmpty()) return List.of();

        // 3. 랜덤 태그 선택
        String randomTag = tags.get(new Random().nextInt(tags.size()));

        // 4. 제외할 도서 ID 수집
        Set<Integer> excludedIdSet = new HashSet<>();
        excludedIdSet.addAll(ratingRepository.findBookIdsByUserId(userId));
        excludedIdSet.addAll(nestRepository.findBookIdsByUserId(userId));
        excludedIdSet.addAll(bookMarkRepository.findBookIdsByUserId(userId));
        if (excludedIdSet.isEmpty()) excludedIdSet.add(-1);
        List<Integer> excludedIds = new ArrayList<>(excludedIdSet);

        // 5. 해당 태그의 책 ID만 조회
        List<Integer> candidateIds = bookRepository.findBookIdsByTagNameExcluding(randomTag, excludedIds);

        // 6. Java에서 랜덤으로 섞고 15개 뽑기
        Collections.shuffle(candidateIds);
        List<Integer> selectedIds = candidateIds.stream().limit(15).toList();

        // 7. 최종 도서 조회
        List<Book> books = bookRepository.findAllByIdWithAuthors(selectedIds);

        // 8. DTO 변환
        return books.stream()
                .map(book -> FavoriteTagBookResponse.of(book, randomTag))
                .toList();
    }



    // 사용자가 가장 많이 본 카테고리에서 추천
    @Transactional(readOnly = true)
    public List<FavoriteCategoryBookResponse> getFavoriteCategoryBooks(Integer userId) {

        // 1. 사용자 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 2. 선호 카테고리 가져오기
        List<String> categories = userCategoryAnalysisRepository.findTopCategoryNamesByUserId(userId);
        if (categories == null || categories.isEmpty()) {
            throw new RuntimeException("유저의 선호 카테고리가 없습니다.");
        }

        // 3. 랜덤 카테고리 선택
        String randomCategory = categories.get(new Random().nextInt(categories.size()));

        // 4. 제외할 도서 ID 수집
        Set<Integer> excludedIdSet = new HashSet<>();
        excludedIdSet.addAll(ratingRepository.findBookIdsByUserId(userId));
        excludedIdSet.addAll(nestRepository.findBookIdsByUserId(userId));
        excludedIdSet.addAll(bookMarkRepository.findBookIdsByUserId(userId));
        if (excludedIdSet.isEmpty()) excludedIdSet.add(-1);
        List<Integer> excludedIds = new ArrayList<>(excludedIdSet);

        // 5. 해당 카테고리에서 제외 도서 빼고 ID만 조회
        List<Integer> candidateIds = bookRepository.findBookIdsByCategoryNameExcluding(randomCategory, excludedIds);

        // 6. Java에서 랜덤 추출
        Collections.shuffle(candidateIds);
        List<Integer> selectedIds = candidateIds.stream().limit(15).toList();

        // 7. 최종 Book 엔티티 조회
        List<Book> books = bookRepository.findAllById(selectedIds);

        // 8. DTO 변환
        return books.stream()
                .map(book -> FavoriteCategoryBookResponse.of(book, randomCategory))
                .toList();
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
