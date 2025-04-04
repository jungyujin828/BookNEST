package com.ssafy.booknest.domain.book.scheduler;

import com.ssafy.booknest.domain.book.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PopularAuthorScheduler {

    private final BookService bookService;

    @Scheduled(fixedRate = 1000 * 60 * 60 * 2) // 2시간마다
    public void runBatch() {
        bookService.updatePopularAuthors();
    }
}
