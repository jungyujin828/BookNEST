package com.ssafy.booknest.domain.search.service;

import com.ssafy.booknest.domain.follow.repository.FollowRepository;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final BookSearchRepository bookSearchRepository;
    private final UserSearchRepository userSearchRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final PopularKeywordService popularKeywordService;

    public CustomPage<BookSearchResponse> searchBooks(Integer userId, String keyword, List<String> tags, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        // 태그와 키워드 둘 다 없으면 빈 결과 반환
        if ((keyword == null || keyword.isBlank()) && (tags == null || tags.isEmpty())) {
            return new CustomPage<>(Page.empty());
        }

        Page<SearchedBook> books;

        if (tags != null && !tags.isEmpty()) {
            // 태그만 있는 경우에도 이 메서드에서 처리
            books = bookSearchRepository.searchByTagsAndKeyword(tags, keyword, pageable);
        } else {
            // 키워드만 있는 경우
            books = bookSearchRepository.findByTitleContainingOrAuthorsContaining(keyword, keyword, pageable);
        }

        if (keyword != null && !keyword.isBlank()) {
            popularKeywordService.increaseKeywordCount(keyword);
        }

        return new CustomPage<>(books.map(BookSearchResponse::of));
    }


    public SearchedBook saveBook(SearchedBook book) {
        return bookSearchRepository.save(book);
    }

    public SerachedUser saveUser(SerachedUser user) { return userSearchRepository.save(user); }

    public CustomPage<UserSearchResponse> searchUser(Integer userId, String name, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new CustomException(ErrorCode.USER_NOT_FOUND));

        if (name == null || name.isEmpty()) {
            return new CustomPage<>(Page.empty());
        }

        Page<SerachedUser> users = userSearchRepository.findByNicknameContaining(name, pageable);

        // 검색된 유저 ID 리스트 추출
        List<Integer> userIds = users.getContent().stream()
                .map(SerachedUser::id)
                .toList();

        // 단 한 번의 쿼리로 모든 팔로우 관계 조회
        Set<Integer> followingIds = new HashSet<>(followRepository.findFollowingIds(userId, userIds));

        // 팔로우 여부를 반영하여 응답 객체 생성
        List<UserSearchResponse> responseList = users.getContent().stream()
                .map(searchedUser -> {
                    boolean isFollowing = followingIds.contains(searchedUser.id());
                    return UserSearchResponse.of(searchedUser, isFollowing);
                })
                .toList();

        return new CustomPage<>(new PageImpl<>(responseList, pageable, users.getTotalElements()));
    }
}
