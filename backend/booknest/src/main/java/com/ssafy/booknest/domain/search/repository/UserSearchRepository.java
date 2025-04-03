package com.ssafy.booknest.domain.search.repository;

import com.ssafy.booknest.domain.search.record.SerachedUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface UserSearchRepository extends ElasticsearchRepository<SerachedUser, String> {
    Page<SerachedUser> findByNicknameContaining(String nickname, Pageable pageable);
}
