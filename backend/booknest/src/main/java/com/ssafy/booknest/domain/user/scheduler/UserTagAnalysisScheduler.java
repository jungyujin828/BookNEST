package com.ssafy.booknest.domain.user.scheduler;

import com.ssafy.booknest.domain.book.entity.BookTag;
import com.ssafy.booknest.domain.book.entity.Rating;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.UserTagAnalysis;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.domain.user.repository.UserTagAnalysisRepository;
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
public class UserTagAnalysisScheduler {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final UserTagAnalysisRepository userTagAnalysisRepository;

    @Transactional
    @Scheduled(fixedRate = 1000 * 60 * 5)
    public void runUserTagAnalysisBatch() {
        log.info("[태그 배치 시작] 유저 선호 분석");

        List<Rating> allRatings = ratingRepository.findAllWithBookAndTag();
        Map<Integer, Map<String, List<Double>>> userTagRatings = new HashMap<>();

        for (Rating rating : allRatings) {
            Integer userId = rating.getUser().getId();
            userTagRatings.putIfAbsent(userId, new HashMap<>());

            List<BookTag> bookTags = rating.getBook().getBookTags();
            if (bookTags != null) {
                Map<String, List<Double>> tagMap = userTagRatings.get(userId);
                for (BookTag bookTag : bookTags) {
                    String tagName = bookTag.getTag().getName();
                    tagMap.putIfAbsent(tagName, new ArrayList<>());
                    tagMap.get(tagName).add(rating.getRating());
                }
            }
        }

        for (Integer userId : userTagRatings.keySet()) {
            Map<String, List<Double>> tagMap = userTagRatings.get(userId);
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) continue;

            String favoriteTag = tagMap.entrySet().stream()
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            e -> e.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0)
                    ))
                    .entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);

            UserTagAnalysis analysis = userTagAnalysisRepository.findByUser(userOpt.get())
                    .orElse(UserTagAnalysis.builder().user(userOpt.get()).build());

            analysis.update(favoriteTag);
            userTagAnalysisRepository.save(analysis);
        }

        log.info("[태그 배치 완료] 유저 분석 테이블 갱신 완료");
        log.info("***************************************************************************************************");
    }
}
