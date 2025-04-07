package com.ssafy.booknest.global.common.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
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
    private final Path logPath = Paths.get("logs", "user_logs_" + LocalDate.now() + ".jsonl");

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(logPath.getParent());
        if (!Files.exists(logPath)) {
            Files.createFile(logPath);
        }
    }

    @Async
    public void logAction(Integer userId, Integer bookId, String actionType) {
        Map<String, Object> log = Map.of(
                "user_id", userId,
                "book_id", bookId,
                "timestamp", Instant.now().toString(),
                "action_type", actionType
        );

        try {
            String jsonLine = objectMapper.writeValueAsString(log) + "\n";
            Files.write(logPath, jsonLine.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);
        } catch (IOException e) {
            // 실패 시 로깅만 하고 무시
            System.err.println("Failed to write log: " + e.getMessage());
        }
    }
}
