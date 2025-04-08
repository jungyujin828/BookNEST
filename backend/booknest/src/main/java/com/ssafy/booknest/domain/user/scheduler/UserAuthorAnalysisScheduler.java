package com.ssafy.booknest.domain.user.scheduler;

import com.ssafy.booknest.domain.book.entity.BookAuthor;
import com.ssafy.booknest.domain.book.entity.Rating;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.UserAuthorAnalysis;
import com.ssafy.booknest.domain.user.repository.UserAuthorAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserAuthorAnalysisScheduler {

    private final RatingRepository ratingRepository;
    private final UserAuthorAnalysisRepository userAuthorAnalysisRepository;

    @Transactional
    @Scheduled(fixedRate = 1000 * 60 * 6) // 6분마다 실행
    public void runUserAuthorAnalysisBatch() {
        log.info("[작가 배치 시작] 유저 선호 분석");

        List<Rating> allRatings = ratingRepository.findAllWithBookAndAuthor();

        Map<User, Map<String, List<Double>>> userAuthorRatings = new HashMap<>();

        // 1. 유저별 작가별 평점 수집
        for (Rating rating : allRatings) {
            User user = rating.getUser();
            userAuthorRatings.putIfAbsent(user, new HashMap<>());

            for (BookAuthor bookAuthor : rating.getBook().getBookAuthors()) {
                String authorName = bookAuthor.getAuthor().getName();
                userAuthorRatings.get(user)
                        .computeIfAbsent(authorName, k -> new ArrayList<>())
                        .add(rating.getRating());
            }
        }

        // 2. 유저별 평균 평점 기준 상위 작가 5명 저장
        for (Map.Entry<User, Map<String, List<Double>>> entry : userAuthorRatings.entrySet()) {
            User user = entry.getKey();
            Map<String, List<Double>> authorRatings = entry.getValue();

            List<String> topAuthors = authorRatings.entrySet().stream()
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            e -> e.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0)
                    ))
                    .entrySet().stream()
                    .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                    .limit(5)
                    .map(Map.Entry::getKey)
                    .toList();

            // 기존 분석 데이터 삭제
            userAuthorAnalysisRepository.deleteByUser(user);

            // 새로 저장
            for (String author : topAuthors) {
                UserAuthorAnalysis analysis = UserAuthorAnalysis.builder()
                        .user(user)
                        .favoriteAuthor(author)
                        .build();
                userAuthorAnalysisRepository.save(analysis);
            }
        }

        log.info("[작가 배치 완료] 유저 분석 테이블 갱신 완료");
        log.info("********************************************");
    }
}

