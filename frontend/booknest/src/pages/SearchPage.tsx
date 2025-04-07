import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SearchTag from "../components/SearchTag";
import SearchRecent from "../components/SearchRecent";
import SearchHot from "../components/SearchHot";
import { useSearchParams } from "react-router-dom";

interface User {
  id: number;
  nickname: string;
  profileURL: string;
  isFollowing: boolean;
}

interface Book {
  bookId: number;
  title: string;
  imageURL: string;
  authors: string;
  tags?: string[];
}

interface SearchResult {
  content: Book[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const SearchContainer = styled.div`
  padding: 16px;
`;

const BookList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BookCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const BookCover = styled.img`
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
`;

const BookAuthor = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const BookTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
`;

const Tag = styled.span`
  padding: 2px 8px;
  background-color: #f0f8f1;
  color: #7bc47f;
  border-radius: 12px;
  font-size: 12px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  border: none;
  background: none;
  font-size: 16px;
  color: ${(props) => (props.active ? "#7bc47f" : "#666")};
  border-bottom: 2px solid ${(props) => (props.active ? "#7bc47f" : "transparent")};
  cursor: pointer;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FollowButton = styled.button<{ isFollowing: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background-color: ${(props) => (props.isFollowing ? "#f1f1f1" : "#7bc47f")};
  color: ${(props) => (props.isFollowing ? "#666" : "white")};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isFollowing ? "#e1e1e1" : "#6ab36e")};
  }
`;

const SearchBarWrapper = styled.div`
  position: relative;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
  border-radius: 8px;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.active ? "#7bc47f" : "#ddd")};
  background-color: ${(props) => (props.active ? "#7bc47f" : "white")};
  color: ${(props) => (props.active ? "white" : "#666")};
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.active ? "#6ab36e" : "#f5f5f5")};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ResultCount = styled.div`
  margin: 16px 0;
  color: #666;
  font-size: 14px;
`;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"books" | "users">(
    (searchParams.get("type") as "books" | "users") || "books"
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const searchBarRef = useRef<any>(null);
  const navigate = useNavigate();
  const [isSearchActive, setIsSearchActive] = useState(false);

  // 검색 파라미터 업데이트 함수
  const updateSearchParams = (newSearchTerm?: string, newTags?: string[], newType?: "books" | "users") => {
    const params = new URLSearchParams(searchParams);

    if (newSearchTerm !== undefined) {
      if (newSearchTerm) params.set("query", newSearchTerm);
      else params.delete("query");
    }

    if (newTags !== undefined) {
      if (newTags.length > 0) params.set("tags", newTags.join(","));
      else params.delete("tags");
    }

    if (newType !== undefined) {
      params.set("type", newType);
    }

    setSearchParams(params);
  };

  // 기존 핸들러들 수정
  const handleTagSelect = async (tag: string) => {
    console.log("SearchPage - Tag Selected:", tag);
    console.log("SearchPage - Current Tags:", selectedTags);

    // 새로운 태그 배열 생성
    const newSelectedTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];

    console.log("SearchPage - New Tags Array:", newSelectedTags);

    // 상태 업데이트
    setSelectedTags(newSelectedTags);
    updateSearchParams(searchTerm, newSelectedTags);

    // 검색 실행
    try {
      console.log("Searching with tags:", newSelectedTags);
      const response = await api.get("/api/search/book", {
        params: {
          page: 1,
          size: 10,
          ...(searchTerm && { title: searchTerm }),
          ...(newSelectedTags.length > 0 && { tags: newSelectedTags }),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v));
            } else {
              searchParams.append(key, value as string);
            }
          });
          return searchParams.toString();
        },
      });

      console.log("Search API Response:", response.data);

      if (response.data.success) {
        const processedData: SearchResult = response.data.data;
        console.log("Processed search results:", processedData);

        setCurrentPage(1);
        setTotalBooks(processedData.totalElements);
        setTotalPages(processedData.totalPages);
        setBooks(processedData.content);
      }
    } catch (error) {
      console.error("Failed to search with tags:", error);
      // 에러 발생 시 상태 초기화
      setBooks([]);
      setTotalBooks(0);
      setTotalPages(0);
    }
  };

  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);
    if (!value) {
      setIsSearchActive(false);
    }
    // 검색어가 변경될 때마다 현재 선택된 태그와 함께 검색
    try {
      const response = await api.get("/api/search/book", {
        params: {
          page: 1,
          size: 10,
          ...(value && { title: value }),
          ...(selectedTags.length > 0 && { tags: selectedTags }),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v));
            } else {
              searchParams.append(key, value as string);
            }
          });
          return searchParams.toString();
        },
      });

      if (response.data.success) {
        const processedData: SearchResult = response.data.data;
        setCurrentPage(1);
        setTotalBooks(processedData.totalElements);
        setTotalPages(processedData.totalPages);
        setBooks(processedData.content);
        if (value) {
          setIsSearchActive(true);
        }
      }
    } catch (error) {
      console.error("Failed to search:", error);
      // 에러 발생 시 상태 초기화
      setBooks([]);
      setTotalBooks(0);
      setTotalPages(0);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setBooks([]);
    setUsers([]);
    setTotalBooks(0);
    setTotalPages(0);
    setIsSearchActive(false);
    updateSearchParams("", []);
  };

  // 함수 이름을 handleTabChange로 변경
  const handleTabChange = (tab: "books" | "users") => {
    setActiveTab(tab);
    setIsSearchActive(false);
    updateSearchParams(undefined, undefined, tab);
  };

  const handleSearchResult = (data: any) => {
    if (activeTab === "books") {
      console.log("Received books data:", data);
      console.log(
        "Books tags:",
        data.map((book: Book) => ({ title: book.title, tags: book.tags }))
      );
      setBooks(data);
      setUsers([]);
    } else {
      setUsers(data);
      setBooks([]);
    }
  };

  const handleFollowClick = async (e: React.MouseEvent, userId: number) => {
    e.stopPropagation();
    try {
      const targetUser = users.find((u) => u.id === userId);
      if (!targetUser) return;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      if (targetUser.isFollowing) {
        // 언팔로우 요청
        const response = await api.delete(`/api/follow?targetUserId=${userId}`, { headers });
        if (response.data.success) {
          setUsers(users.map((user) => (user.id === userId ? { ...user, isFollowing: false } : user)));
        }
      } else {
        // 팔로우 요청
        const response = await api.post(`/api/follow?targetUserId=${userId}`, {}, { headers });
        if (response.data.success) {
          setUsers(users.map((user) => (user.id === userId ? { ...user, isFollowing: true } : user)));
        }
      }
    } catch (error) {
      console.error("팔로우/언팔로우 작업 실패:", error);
    }
  };

  // SearchTag에서는 onSearch 호출 제거

  const triggerSearch = async (page: number = currentPage) => {
    console.log("SearchPage - Triggering Search with tags:", selectedTags);
    try {
      const response = await api.get("/api/search/book", {
        params: {
          page,
          size: 10,
          ...(searchTerm && { title: searchTerm }),
          ...(selectedTags.length > 0 && { tags: selectedTags }),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v));
            } else {
              searchParams.append(key, value as string);
            }
          });
          return searchParams.toString();
        },
      });

      if (response.data.success) {
        const processedData: SearchResult = response.data.data;
        setTotalBooks(processedData.totalElements);
        setTotalPages(processedData.totalPages);
        setBooks(processedData.content);
      }
    } catch (error) {
      console.error("Failed to search:", error);
      // 에러 발생 시 상태 초기화
      setBooks([]);
      setTotalBooks(0);
      setTotalPages(0);
    }
  };

  // Add state for search focus
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchFocus = () => {
    if (searchTerm === "") {
      setShowRecent(true);
    }
  };

  const handleSearchBlur = () => {
    // 약간의 지연을 주어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      setShowRecent(false);
    }, 200);
  };

  const shouldShowTags =
    activeTab === "books" && !showRecent && (!isSearchActive || (isSearchActive && selectedTags.length > 0));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    triggerSearch(page);
  };

  return (
    <SearchContainer>
      <TabContainer>
        <Tab active={activeTab === "books"} onClick={() => handleTabChange("books")}>
          도서
        </Tab>
        <Tab active={activeTab === "users"} onClick={() => handleTabChange("users")}>
          유저
        </Tab>
      </TabContainer>

      <SearchBarWrapper>
        <SearchBar
          ref={searchBarRef}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClear={() => {
            handleClear();
            setSelectedTags([]);
          }}
          searchType={activeTab}
          onSearchResult={handleSearchResult}
          placeholder={activeTab === "books" ? "도서 검색" : "유저 검색"}
          selectedTags={selectedTags}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />

        {showRecent && searchTerm === "" && (
          <>
            <SearchRecent
              onSelect={(query) => {
                setSearchTerm(query);
                setIsSearchActive(true);
                handleSearchChange(query);
              }}
              onClose={() => setShowRecent(false)}
            />
            <SearchHot
              onSelect={(query) => {
                setSearchTerm(query);
                setIsSearchActive(true);
                handleSearchChange(query);
              }}
            />
          </>
        )}
      </SearchBarWrapper>

      {shouldShowTags && (
        <SearchTag
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onClearTags={() => setSelectedTags([])}
          onSearch={() => triggerSearch(1)}
        />
      )}

      {activeTab === "books" && books.length > 0 && <ResultCount>총 {totalBooks}개의 검색결과</ResultCount>}

      {activeTab === "books" ? (
        <>
          <BookList>
            {books.map((book) => (
              <BookCard key={book.bookId} onClick={() => navigate(`/book-detail/${book.bookId}`)}>
                <BookCover src={book.imageURL} alt={book.title} />
                <BookInfo>
                  <BookTitle>{book.title}</BookTitle>
                  <BookAuthor>{book.authors}</BookAuthor>
                  {book.tags && book.tags.length > 0 && (
                    <BookTags>
                      {book.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </BookTags>
                  )}
                </BookInfo>
              </BookCard>
            ))}
          </BookList>

          {totalPages > 1 && (
            <PaginationContainer>
              <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                이전
              </PageButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && <span>...</span>}
                    <PageButton active={currentPage === page} onClick={() => handlePageChange(page)}>
                      {page}
                    </PageButton>
                  </React.Fragment>
                ))}
              <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                다음
              </PageButton>
            </PaginationContainer>
          )}
        </>
      ) : (
        <UserList>
          {users.map((user) => (
            <UserCard key={user.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <UserAvatar src={user.profileURL} alt={user.nickname} />
                <UserInfo>
                  <UserName>{user.nickname}</UserName>
                </UserInfo>
              </div>
              {Number(localStorage.getItem("userId")) !== user.id && (
                <FollowButton isFollowing={user.isFollowing} onClick={(e) => handleFollowClick(e, user.id)}>
                  {user.isFollowing ? "팔로잉" : "팔로우"}
                </FollowButton>
              )}
            </UserCard>
          ))}
        </UserList>
      )}
    </SearchContainer>
  );
};

export default SearchPage;
