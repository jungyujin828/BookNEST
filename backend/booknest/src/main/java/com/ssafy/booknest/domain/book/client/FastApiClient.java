package com.ssafy.booknest.domain.book.client;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class FastApiClient {

    private static final String FASTAPI_URL = "http://localhost:8000/recommend/today"; // FastAPI 서버 주소

    public Map<String, Object> requestTodayRecommendation(Integer userId) {
        RestTemplate restTemplate = new RestTemplate();

        // 요청 본문 만들기
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("user_id", userId);

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 요청 엔티티 구성
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            // POST 요청 보내기
            ResponseEntity<Map> response = restTemplate.postForEntity(FASTAPI_URL, requestEntity, Map.class);
            return response.getBody(); // 응답 결과 반환
        } catch (Exception e) {
            System.out.println("FastAPI 호출 에러: " + e.getMessage());
            return Map.of("db_status", "error", "detail", e.getMessage());
        }
    }
}
