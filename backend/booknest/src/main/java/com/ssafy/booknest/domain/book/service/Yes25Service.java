package com.ssafy.booknest.domain.book.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

@Service
public class Yes25Service {

    public String getYes25UrlByIsbn(String isbn) {
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
            System.out.println("YES24 크롤링 실패: " + e.getMessage());
        }

        return null;
    }
}
