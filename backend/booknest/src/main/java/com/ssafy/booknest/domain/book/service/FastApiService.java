package com.ssafy.booknest.domain.book.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.booknest.domain.book.client.FastApiClient;
import com.ssafy.booknest.domain.book.dto.response.FastApiRecommendation;
import com.ssafy.booknest.domain.book.dto.response.FastApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FastApiService {

    private final FastApiClient fastApiClient;

    public List<FastApiRecommendation> getTodayRecommendations(Integer userId) {
        Map<String, Object> response = fastApiClient.requestTodayRecommendation(userId);

        // 예외 처리
        if (!"ok".equals(response.get("db_status"))) {
            throw new RuntimeException("FastAPI 오류: " + response.get("detail"));
        }

        // JSON 파싱
        ObjectMapper mapper = new ObjectMapper();
        List<FastApiRecommendation> list = mapper.convertValue(
                response.get("result"),
                new TypeReference<List<FastApiRecommendation>>() {}
        );

        return list;
    }

    public List<FastApiRecommendation> getBookLoanRecommendations(Integer userId) {
        Map<String, Object> response = fastApiClient.requestLoanLogRecommendation(userId);

        // 예외 처리
        if (!"ok".equals(response.get("db_status"))) {
            throw new RuntimeException("FastAPI 오류: " + response.get("detail"));
        }

        // JSON 파싱
        ObjectMapper mapper = new ObjectMapper();
        List<FastApiRecommendation> list = mapper.convertValue(
                response.get("result"),
                new TypeReference<List<FastApiRecommendation>>() {}
        );

        return list;
    }

    public List<FastApiRecommendation> getRecentKeywordRecommendations(Integer userId) {
        Map<String, Object> response = fastApiClient.requestRecentTagRecommendation(userId);

        // 예외 처리
        if (!"ok".equals(response.get("db_status"))) {
            throw new RuntimeException("FastAPI 오류: " + response.get("detail"));
        }

        // JSON 파싱
        ObjectMapper mapper = new ObjectMapper();
        List<FastApiRecommendation> list = mapper.convertValue(
                response.get("result"),
                new TypeReference<List<FastApiRecommendation>>() {}
        );

        return list;
    }
}



