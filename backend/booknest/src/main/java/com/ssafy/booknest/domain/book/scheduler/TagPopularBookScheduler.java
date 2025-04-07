package com.ssafy.booknest.domain.book.scheduler;

import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.entity.TagRandomBook;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.TagRandomBookRepository;
import com.ssafy.booknest.domain.nest.entity.BookNest;
import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.domain.nest.repository.NestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class TagPopularBookScheduler {

    private final NestRepository nestRepository;
    private final TagRandomBookRepository tagRandomBookRepository;
    private final BookRepository bookRepository;

    @Scheduled(fixedRate = 1000 * 60 * 60 * 2) // 2시간마다 실행
    @Transactional
    public void runTagBasedBookBatch() {
        log.info("[배치 시작] 태그별 인기 도서 선정 시작");

        List<Nest> allNests = nestRepository.findAllWithBooksOnly();
        Map<String, Map<Book, Long>> tagBookCount = new HashMap<>();

        // 사용자 서재에서 책별 태그 카운트 수집
        for (Nest nest : allNests) {
            for (BookNest bookNest : nest.getBookNests()) {
                Book book = bookNest.getBook();
                Set<String> tags = book.getBookTags().stream()
                        .map(bt -> bt.getTag().getName())
                        .collect(Collectors.toSet()); // 중복 태그 제거

                for (String tag : tags) {
                    tagBookCount
                            .computeIfAbsent(tag, k -> new HashMap<>())
                            .merge(book, 1L, Long::sum);
                }
            }
        }

        // 기존 데이터 초기화
        tagRandomBookRepository.deleteAllInBatch();

        // 태그별 상위 15권 선정 및 저장
        for (Map.Entry<String, Map<Book, Long>> entry : tagBookCount.entrySet()) {
            String tag = entry.getKey();
            Map<Book, Long> bookCounts = entry.getValue();

            // 상위 15권 정렬 및 중복 제거
            LinkedHashSet<Book> topBooks = bookCounts.entrySet().stream()
                    .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                    .map(Map.Entry::getKey)
                    .limit(15)
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            // 부족할 경우 랜덤으로 보충 (중복 방지)
            if (topBooks.size() < 15) {
                List<Book> randomBooks = bookRepository.findRandomBooksByTag(tag, PageRequest.of(0, 15 - topBooks.size()));
                for (Book book : randomBooks) {
                    topBooks.add(book);
                    if (topBooks.size() == 15) break;
                }
            }

            // 저장
            for (Book book : topBooks) {
                TagRandomBook entity = TagRandomBook.builder()
                        .tag(tag)
                        .book(book)
                        .build();
                tagRandomBookRepository.save(entity);
            }

            log.info("[{}] 태그 인기 도서 등록 완료. 총 {}권", tag, topBooks.size());
        }

        log.info("[배치 완료] 태그별 인기 도서 테이블 갱신 완료");
        log.info("***************************************************************************************************");
    }
}
