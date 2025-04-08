package com.ssafy.booknest.global.common.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserActionLogger {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseLogDir = "/app/logs";

    @Async
    public void logAction(Integer userId, Integer bookId, String actionType) {
        Map<String, Object> log = Map.of(
                "user_id", userId,
                "book_id", bookId,
                "timestamp", Instant.now().toString(),
                "action_type", actionType
        );

        try {
            // 매번 현재 날짜 기준으로 파일 경로 설정
            Path logPath = Paths.get(baseLogDir, "user_logs_" + LocalDate.now() + ".jsonl");

            // 파일 없으면 생성
            if (!Files.exists(logPath)) {
                Files.createFile(logPath);
            }

            // JSONL 로그 작성
            String jsonLine = objectMapper.writeValueAsString(log) + "\n";
            Files.write(logPath, jsonLine.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);

        } catch (IOException e) {
            System.err.println("Failed to write user log: " + e.getMessage());
        }
    }
}
