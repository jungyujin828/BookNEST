import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import config from "../config";

// 인터페이스 정의
interface Book {
  bookId: number;
  title: string;
  publishedDate: string;
  bookImage: string;
  authors: string[];
}

interface SearchResponse {
  success: boolean;
  data: {
    content: Book[];
    pageNumber: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    first: boolean;
    last: boolean;
  };
  error: null | {
    code: string;
    message: string;
    details?: string;
  };
}

// 스타일 컴포넌트
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const SearchBox = styled.div`
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const BookList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const BookCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const BookImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  background-color: #f5f5f5;
`;

const BookInfo = styled.div`
  padding: 15px;
`;

const BookTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
`;

const BookAuthor = styled.p`
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
`;

const BookDate = styled.p`
  margin: 0;
  color: #999;
  font-size: 12px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${(props) => (props.isActive ? "#4a90e2" : "white")};
  color: ${(props) => (props.isActive ? "white" : "#333")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#4a90e2" : "#f5f5f5")};
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  padding: 20px;
  background-color: #fff3f3;
  border-radius: 8px;
  margin: 20px 0;
`;

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchBooks = async (page: number) => {
    if (!searchTerm.trim()) {
      setError("검색어를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      //   if (!token) {
      //     setError("로그인이 필요한 서비스입니다.");
      //     return;
      //   }

      const response = await axios.get<SearchResponse>(`${config.api.baseUrl}/book/search`, {
        params: {
          title: searchTerm,
          page: page,
          size: 10,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setBooks(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setCurrentPage(page);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.error?.message || "검색 중 오류가 발생했습니다.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBooks(1);
  };

  const handlePageChange = (page: number) => {
    searchBooks(page);
  };

  return (
    <Container>
      <SearchBox>
        <form onSubmit={handleSearch}>
          <SearchInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="도서명을 입력하세요"
          />
        </form>
      </SearchBox>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <div>검색 중...</div>
      ) : (
        <>
          <BookList>
            {books.map((book) => (
              <BookCard key={book.bookId}>
                <BookImage
                  src={book.bookImage || "/images/default-book.png"}
                  alt={book.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/default-book.png";
                  }}
                />
                <BookInfo>
                  <BookTitle>{book.title}</BookTitle>
                  <BookAuthor>{book.authors.join(", ")}</BookAuthor>
                  <BookDate>{book.publishedDate}</BookDate>
                </BookInfo>
              </BookCard>
            ))}
          </BookList>

          {totalPages > 0 && (
            <Pagination>
              <PageButton onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                처음
              </PageButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => Math.abs(page - currentPage) <= 2)
                .map((page) => (
                  <PageButton key={page} isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                    {page}
                  </PageButton>
                ))}
              <PageButton onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                마지막
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchPage;
