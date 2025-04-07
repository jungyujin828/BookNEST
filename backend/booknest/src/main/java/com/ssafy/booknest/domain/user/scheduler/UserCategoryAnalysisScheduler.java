package com.ssafy.booknest.domain.user.scheduler;

import com.ssafy.booknest.domain.book.entity.BookCategory;
import com.ssafy.booknest.domain.book.entity.Rating;
import com.ssafy.booknest.domain.book.repository.RatingRepository;
import com.ssafy.booknest.domain.nest.entity.BookNest;
import com.ssafy.booknest.domain.nest.entity.Nest;
import com.ssafy.booknest.domain.nest.repository.NestRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.entity.UserCategoryAnalysis;
import com.ssafy.booknest.domain.user.repository.UserCategoryAnalysisRepository;
import com.ssafy.booknest.domain.user.repository.UserRepository;
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
public class UserCategoryAnalysisScheduler {

    private final RatingRepository ratingRepository;
    private final UserCategoryAnalysisRepository userCategoryAnalysisRepository;

    @Transactional
    @Scheduled(fixedRate = 1000 * 60 * 4)
    public void runUserCategoryAnalysisBatch() {
        log.info("[카테고리 배치 시작] 유저 선호 분석");

        List<Rating> allRatings = ratingRepository.findAllWithBookAndCategory();

        Map<User, Map<String, List<Double>>> userCategoryRatings = new HashMap<>();

        for (Rating rating : allRatings) {
            User user = rating.getUser();
            List<BookCategory> categories = rating.getBook().getBookCategories();

            userCategoryRatings.putIfAbsent(user, new HashMap<>());

            for (BookCategory bookCategory : categories) {
                String categoryName = bookCategory.getCategory().getName();
                userCategoryRatings.get(user)
                        .computeIfAbsent(categoryName, k -> new ArrayList<>())
                        .add(rating.getRating());
            }
        }

        for (User user : userCategoryRatings.keySet()) {
            Map<String, List<Double>> categoryRatings = userCategoryRatings.get(user);

            String favoriteCategory = categoryRatings.entrySet().stream()
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            e -> e.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0)
                    ))
                    .entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);

            UserCategoryAnalysis analysis = userCategoryAnalysisRepository.findByUser(user)
                    .orElse(UserCategoryAnalysis.builder().user(user).build());

            analysis.update(favoriteCategory);
            userCategoryAnalysisRepository.save(analysis);
        }


        log.info("[카테고리 배치 완료] 유저 분석 테이블 갱신 완료");
        log.info("***************************************************************************************************");
    }
}
