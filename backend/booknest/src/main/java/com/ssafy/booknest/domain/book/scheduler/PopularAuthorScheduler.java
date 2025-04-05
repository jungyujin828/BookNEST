package com.ssafy.booknest.domain.book.scheduler;

import com.ssafy.booknest.domain.book.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PopularAuthorScheduler {

    private final BookService bookService;

    @Scheduled(fixedRate = 1000 * 60 * 60 * 2) // 서버 실행 후 2시간 마다 PopularAuthorBook 테이블 갱신
    public void runBatch() {
        bookService.updatePopularAuthors();
    }
}
