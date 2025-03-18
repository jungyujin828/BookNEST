-- nest 테이블에 데이터 삽입
INSERT INTO nest (created_at) VALUES (NOW());

-- 더미 유저
INSERT INTO user (nickname, provider, provider_id, created_at, updated_at, nest_id)
VALUES ('테스트맨1', 'KAKAO', 112312312, NOW(), NOW(), 1);
--         ('테스트맨2', 'KAKAO', 1231440, NOW(), NOW(), 2);
