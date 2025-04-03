package com.ssafy.booknest.domain.book.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class FastApiClient {

    @Value("${fastapi.url}")
    private String fastApiBaseUrl;

    public Map<String, Object> requestTodayRecommendation(Integer userId) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("user_id", userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            String endpoint = fastApiBaseUrl + "/recommend/today"; // 경로 결합
            ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, requestEntity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            System.out.println("FastAPI 호출 에러: " + e.getMessage());
            return Map.of("db_status", "error", "detail", e.getMessage());
        }
    }
}
