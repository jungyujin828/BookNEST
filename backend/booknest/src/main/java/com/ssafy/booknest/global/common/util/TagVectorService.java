package com.ssafy.booknest.global.common.util;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class TagVectorService {

    private final RedisTemplate<String, String> redisTemplate;

    private String getUserTagVectorKey(Integer userId) {
        return "user:" + userId + ":tag_vector";
    }

    // 태그 점수 증가
    @Async
    public void increaseTagScore(Integer userId, String tag, double score) {
        String key = getUserTagVectorKey(userId);
        redisTemplate.opsForZSet().incrementScore(key, tag, score);
    }

}
