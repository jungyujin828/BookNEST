package com.ssafy.booknest.domain.search.service;

import com.ssafy.booknest.domain.search.dto.response.BookSearchResponse;
import com.ssafy.booknest.domain.search.dto.response.UserSearchResponse;
import com.ssafy.booknest.domain.search.record.SearchedBook;
import com.ssafy.booknest.domain.search.record.SerachedUser;
import com.ssafy.booknest.domain.search.repository.BookSearchRepository;
import com.ssafy.booknest.domain.search.repository.UserSearchRepository;
import com.ssafy.booknest.domain.user.entity.User;
import com.ssafy.booknest.domain.user.repository.UserRepository;
import com.ssafy.booknest.global.common.CustomPage;
import com.ssafy.booknest.global.error.ErrorCode;
import com.ssafy.booknest.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final BookSearchRepository bookSearchRepository;
    private final UserSearchRepository userSearchRepository;
    private final UserRepository userRepository;

    public CustomPage<BookSearchResponse> searchBooks(Integer userId, String title, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        if (title == null || title.isEmpty()) {
            return new CustomPage<>(Page.empty());  // 빈 목록 반환
        }

        Page<SearchedBook> books = bookSearchRepository.findByTitleContaining(title, pageable);
        return new CustomPage<>(books.map(BookSearchResponse::of));
    }

    public SearchedBook saveBook(SearchedBook book) {
        return bookSearchRepository.save(book);
    }

    public SerachedUser saveUser(SerachedUser user) { return userSearchRepository.save(user); }

    public CustomPage<UserSearchResponse> searchUser(Integer userId, String name, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        if(name == null || name.isEmpty())  {
            return new CustomPage<>(Page.empty());  // 빈 목록 반환
        }

        Page<SerachedUser> users = userSearchRepository.findByNicknameContaining(name, pageable);
        return new CustomPage<>(users.map(UserSearchResponse::of));
    }
}
