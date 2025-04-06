import React, { useState } from "react";
import styled from "@emotion/styled";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

interface User {
  id: number;
  nickname: string;
  profileURL: string;
  isFollowing: boolean;
}

interface Book {
  bookId: string;
  title: string;
  imageURL: string;
  authors: string;
  tags?: string[];
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

const SearchPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"books" | "users">("books");
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleClear = () => {
    setSearchTerm("");
    setBooks([]);
    setUsers([]);
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

  return (
    <SearchContainer>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClear={handleClear}
        searchType={activeTab}
        onSearchResult={handleSearchResult}
        placeholder={activeTab === "books" ? "도서 검색" : "유저 검색"}
      />

      <TabContainer>
        <Tab active={activeTab === "books"} onClick={() => setActiveTab("books")}>
          도서
        </Tab>
        <Tab active={activeTab === "users"} onClick={() => setActiveTab("users")}>
          유저
        </Tab>
      </TabContainer>

      {activeTab === "books" ? (
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
      ) : (
        <UserList>
          {users.map((user) => (
            <UserCard key={user.id}>
              <div
                style={{ display: "flex", alignItems: "center", flex: 1, cursor: "pointer" }}
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
