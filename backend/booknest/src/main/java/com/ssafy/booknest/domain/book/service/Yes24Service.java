package com.ssafy.booknest.domain.book.service;

import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class Yes24Service {

    public String getYes24UrlByIsbn(String isbn) {
        try {
            // 1. YES24 ISBN 검색 URL
            String searchUrl = "https://www.yes24.com/Product/Search?domain=ALL&query=" + isbn;

            // 2. Jsoup으로 HTML 문서 가져오기
            Document doc = Jsoup.connect(searchUrl).get();

            // 3. 첫 번째 검색 결과 링크 찾기 (책 제목에 해당하는 a 태그)
            Element firstLink = doc.selectFirst("ul#yesSchList li .gd_name");

            if (firstLink != null) {
                String href = firstLink.attr("href");

                // 4. 절대 경로로 만들어 반환
                return "https://www.yes24.com" + href;
            }

        } catch (Exception e) {
            log.error("Failed to fetch YES24 link for ISBN: {}, message: {}", isbn, e.getMessage());
            throw new CustomException(ErrorCode.CRAWLING_FAILED);
        }

        return null;
    }
}
