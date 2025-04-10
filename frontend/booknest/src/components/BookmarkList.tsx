import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaSort } from "react-icons/fa";

interface BookmarkItem {
  bookId: number;
  title: string;
  authors: string[];
  imageUrl: string;
  createdAt: string;
}

const Container = styled.div`
  width: 100%;
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
`;

const BookCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  background-color: white;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BookCover = styled.div`
  position: relative;
  height: 260px;

  @media (max-width: 768px) {
    height: 220px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BookInfo = styled.div`
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const BookTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
`;

const BookAuthor = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CreatedAt = styled.p`
  margin: 0;
  font-size: 12px;
  color: #888;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 48px;
  color: #e53935;
  background-color: #ffebee;
  border-radius: 8px;
`;

const LoginRequiredState = styled.div`
  text-align: center;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eaeaea;
`;

const LoginButton = styled.button`
  background-color: #00c473;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #00b368;
  }
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  position: relative;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 10;
`;

const DropdownItem = styled.button<{ isActive: boolean }>`
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  border: none;
  background-color: ${(props) => (props.isActive ? "#f5f5f5" : "white")};
  cursor: pointer;
  font-size: 14px;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
  }
`;

// Add styled Link component
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

interface BookmarkListProps {
  userId?: number;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ userId }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsAuthError(false);

      console.log("북마크 목록 조회 시작");
      const response = await api.get("/api/nest/bookmark");
      console.log("북마크 목록 응답:", response.data);

      if (response.data.success) {
        setBookmarks(response.data.data);
      } else {
        throw new Error(response.data.error?.message || "북마크 목록을 불러오는데 실패했습니다.");
      }
    } catch (err: any) {
      console.error("Failed to fetch bookmarks:", err);
      console.error("Error details:", err.response?.data || err.message);
      console.error("Error status:", err.response?.status);

      // 403 에러 (인증 관련) 처리
      if (err.response && (err.response.status === 403 || err.response.status === 401)) {
        setIsAuthError(true);
        setError("로그인이 필요한 서비스입니다.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("북마크 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const sortBookmarks = (bookmarksToSort: BookmarkItem[]) => {
    return [...bookmarksToSort].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest(".sort-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLoginClick = () => {
    // 현재 URL을 저장하고 로그인 페이지로 리다이렉트
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    navigate("/login");
  };

  const formatAuthors = (authors: string[]) => {
    return authors.join(", ");
  };

  if (loading) {
    return <LoadingState>북마크 목록을 불러오는 중...</LoadingState>;
  }

  if (isAuthError) {
    return (
      <LoginRequiredState>
        <div>로그인이 필요한 서비스입니다.</div>
        <LoginButton onClick={handleLoginClick}>로그인 하기</LoginButton>
      </LoginRequiredState>
    );
  }

  if (error && !isAuthError) {
    return <ErrorState>{error}</ErrorState>;
  }

  if (bookmarks.length === 0) {
    return <EmptyState>찜한 도서가 없습니다.</EmptyState>;
  }

  const sortedBookmarks = sortBookmarks(bookmarks);

  return (
    <Container>
      <SortContainer className="sort-container">
        <SortButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <FaSort />
          {sortOrder === "newest" ? "최신순" : "오래된순"}
        </SortButton>
        <DropdownMenu isOpen={isDropdownOpen}>
          <DropdownItem
            isActive={sortOrder === "newest"}
            onClick={() => {
              setSortOrder("newest");
              setIsDropdownOpen(false);
            }}
          >
            최신순
          </DropdownItem>
          <DropdownItem
            isActive={sortOrder === "oldest"}
            onClick={() => {
              setSortOrder("oldest");
              setIsDropdownOpen(false);
            }}
          >
            오래된순
          </DropdownItem>
        </DropdownMenu>
      </SortContainer>
      <BookGrid>
        {sortedBookmarks.map((book) => (
          <BookCard key={`${book.bookId}-${book.createdAt}`}>
            <StyledLink to={`/book-detail/${book.bookId}`}>
              <BookCover>
                <img src={book.imageUrl} alt={book.title} />
              </BookCover>
              <BookInfo>
                <BookTitle>{book.title}</BookTitle>
                <BookAuthor>{formatAuthors(book.authors)}</BookAuthor>
                <CreatedAt>찜한 날짜: {new Date(book.createdAt).toLocaleDateString()}</CreatedAt>
              </BookInfo>
            </StyledLink>
          </BookCard>
        ))}
      </BookGrid>
    </Container>
  );
};

export default BookmarkList;
