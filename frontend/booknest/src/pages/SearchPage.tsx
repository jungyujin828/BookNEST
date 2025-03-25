import React, { useState } from "react";
import styled from "@emotion/styled";
import api from "../api/axios";

// Styled Components
const SearchContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 25px;
  padding: 8px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 16px;
  &::placeholder {
    color: #999;
  }
`;

const SearchIcon = styled.span`
  color: #666;
  margin-right: 8px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.get("/api/books/search", {
        params: {
          keyword: searchTerm,
          page: 1,
          size: 10,
        },
      });

      if (response.data.success) {
        setSearchResults(response.data.data.content);
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <SearchContainer>
      <SearchBar>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="도서, 작가, 유저 검색"
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        {searchTerm && <ClearButton onClick={handleClear}>✕</ClearButton>}
      </SearchBar>
      {/* SearchTag 컴포넌트는 여기에 추가될 예정 */}
      {/* 검색 결과 표시 영역은 나중에 구현 */}
    </SearchContainer>
  );
};

export default SearchPage;
