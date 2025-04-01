import React, { useState } from "react";
import styled from "@emotion/styled";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Book {
  bookId: string;
  title: string;
  imageURL: string;
  authors: string;
}

interface SearchResponse {
  content: Book[];
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  first: boolean;
  last: boolean;
}

const SearchContainer = styled.div`
  padding: 16px;
`;

const SearchBarContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 45px;
  border-radius: 10px;
  border: none;
  background-color: #f1f1f1;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #666;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  width: 16px;
  height: 16px;

  &::before {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid #666;
    border-radius: 50%;
    top: 0;
    left: 0;
  }

  &::after {
    content: "";
    position: absolute;
    width: 2px;
    height: 6px;
    background-color: #666;
    transform: rotate(-45deg);
    bottom: 0;
    right: 0;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 2px;
    height: 16px;
    background-color: #666;
    top: 0;
    left: 50%;
  }

  &::before {
    transform: translateX(-50%) rotate(45deg);
  }

  &::after {
    transform: translateX(-50%) rotate(-45deg);
  }

  &:hover::before,
  &:hover::after {
    background-color: #333;
  }
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

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<Book[]>([]);

  const handleSearch = async () => {
    try {
      const response = await api.get("/api/search/book", {
        params: {
          title: searchTerm,
          page: 1,
          size: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setBooks(response.data.data.content);
      }
    } catch (error) {
      console.error("Failed to search books:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setBooks([]);
  };

  return (
    <SearchContainer>
      <SearchBarContainer>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="도서, 작가, 유저 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {searchTerm && <ClearButton onClick={handleClear} />}
      </SearchBarContainer>

      <BookList>
        {books.map((book) => (
          <BookCard key={book.bookId} onClick={() => navigate(`/book-detail/${book.bookId}`)}>
            <BookCover src={book.imageURL} alt={book.title} />
            <BookInfo>
              <BookTitle>{book.title}</BookTitle>
              <BookAuthor>{book.authors}</BookAuthor>
            </BookInfo>
          </BookCard>
        ))}
      </BookList>
    </SearchContainer>
  );
};

export default SearchPage;
