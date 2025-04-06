package com.ssafy.booknest.domain.book.scheduler;

import com.ssafy.booknest.domain.book.entity.Book;
import com.ssafy.booknest.domain.book.entity.PopularAuthorBook;
import com.ssafy.booknest.domain.book.repository.BookRepository;
import com.ssafy.booknest.domain.book.repository.PopularAuthorBookRepository;
import com.ssafy.booknest.domain.nest.entity.BookNest;
import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.domain.nest.repository.NestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class PopularAuthorScheduler {

    private final NestRepository nestRepository;
    private final BookRepository bookRepository;
    private final PopularAuthorBookRepository popularAuthorBookRepository;

    @Scheduled(fixedRate = 1000 * 60 * 60 * 3) // 3시간마다 실행
    @Transactional
    public void runPopularAuthorBatch() {
        log.info("[배치 시작] 화제의 작가 책 선정");

        List<Nest> allNests = nestRepository.findAllWithBooksOnly();
        Map<String, Long> authorCount = new HashMap<>();

        for (Nest nest : allNests) {
            for (BookNest bookNest : nest.getBookNests()) {
                String authors = bookNest.getBook().getAuthors();
                if (authors != null && !authors.trim().isEmpty()) {
                    for (String author : authors.split(",")) {
                        author = author.trim();
                        if (!author.isEmpty()) {
                            authorCount.put(author, authorCount.getOrDefault(author, 0L) + 1);
                        }
                    }
                }
            }
        }

        if (authorCount.isEmpty()) {
            log.warn("서재에서 작가를 찾지 못했습니다.");
            return;
        }

        long maxCount = authorCount.values().stream().max(Long::compare).orElse(0L);

        List<String> topAuthors = authorCount.entrySet().stream()
                .filter(entry -> entry.getValue() == maxCount)
                .map(Map.Entry::getKey)
                .toList();

        if (topAuthors.isEmpty()) {
            log.warn("최다 출현 작가가 없습니다.");
            return;
        }

        String selectedAuthor = topAuthors.get(new Random().nextInt(topAuthors.size()));
        List<Book> topBooks = bookRepository.findTop3ByAuthorNameLike(selectedAuthor);

        popularAuthorBookRepository.deleteAllInBatch();

        List<PopularAuthorBook> popularList = topBooks.stream()
                .map(book -> new PopularAuthorBook(selectedAuthor, book))
                .collect(Collectors.toList());

        popularAuthorBookRepository.saveAll(popularList);

        log.info("화제의 작가 [{}] 등록 완료. 책 {}권 저장됨", selectedAuthor, popularList.size());
        log.info("[배치 완료] 화제의 작가 도서 테이블 갱신 완료");
        log.info("***************************************************************************************************");
    }
}
