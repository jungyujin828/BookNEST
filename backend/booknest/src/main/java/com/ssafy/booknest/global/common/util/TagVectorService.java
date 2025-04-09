package com.ssafy.booknest.global.common.util;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
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
    public void increaseTagScore(Integer userId, String tag, double score) {
        String key = getUserTagVectorKey(userId);
        redisTemplate.opsForZSet().incrementScore(key, tag, score);
    }

    // 태그 벡터 조회 (내림차순으로 top N)
    public Set<ZSetOperations.TypedTuple<String>> getTopTags(Integer userId, int topN) {
        String key = getUserTagVectorKey(userId);
        return redisTemplate.opsForZSet().reverseRangeWithScores(key, 0, topN - 1);
    }

    // 특정 태그 점수 조회
    public Double getTagScore(Integer userId, String tag) {
        String key = getUserTagVectorKey(userId);
        return redisTemplate.opsForZSet().score(key, tag);
    }

    // 태그 삭제
    public void removeTag(Integer userId, String tag) {
        String key = getUserTagVectorKey(userId);
        redisTemplate.opsForZSet().remove(key, tag);
    }

    // 전체 태그 초기화 (선택사항)
    public void clearTagVector(Integer userId) {
        String key = getUserTagVectorKey(userId);
        redisTemplate.delete(key);
    }
}
