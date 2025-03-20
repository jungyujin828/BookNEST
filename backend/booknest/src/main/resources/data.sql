-- nest 테이블에 데이터 삽입
INSERT INTO nest (created_at) VALUES (NOW());

-- 더미 유저
INSERT INTO user (nickname, provider, provider_id, created_at, updated_at, nest_id)
VALUES ('테스트맨1', 'KAKAO', 112312312, NOW(), NOW(), 1);
--         ('테스트맨2', 'KAKAO', 1231440, NOW(), NOW(), 2);


INSERT INTO author (name) VALUES ('F. Scott Fitzgerald');



-- book 더미데이터
INSERT INTO book (
    title,
    published_date,
    isbn,
    publisher,
    pages,
    image_url,
    intro,
    `index`,
    created_at,
    publisher_review
) VALUES (
             'The Great Gatsby',
             '1925-04-10',
             '9780743273565',
             'Charles Scribner''s Sons',
             218,
             'https://example.com/great_gatsby_image.jpg',
             'The Great Gatsby is a story about the American dream, set in the 1920s.',
             'Chapter 1: Introduction to Gatsby...',
             NOW(),
             'A timeless classic of American literature.'
         );

INSERT INTO best_seller (book_id) VALUES (1);


INSERT INTO book_author (id, book_id, author_id) VALUES (1, 1, 1);
