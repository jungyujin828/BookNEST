import React from "react";
import styled from "@emotion/styled";
import api from "../api/axios";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  searchType: "books" | "users";
  onSearchResult: (data: any) => void;
}

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

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onClear,
  placeholder = "도서, 작가, 유저 검색",
  searchType,
  onSearchResult,
}) => {
  const handleSearch = async () => {
    try {
      const endpoint =
        searchType === "books" ? "/api/search/book" : "/api/search/user";
      const params =
        searchType === "books"
          ? { title: searchTerm, page: 1, size: 10 }
          : { name: searchTerm, page: 1, size: 10 };

      const response = await api.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        // '_tagsparsefailure' 태그 제거
        const processedData = {
          ...response.data.data,
          content: response.data.data.content.map((item: any) => ({
            ...item,
            tags:
              item.tags?.filter((tag: string) => tag !== "_tagsparsefailure") ||
              [],
          })),
        };
        onSearchResult(processedData.content);
      }
    } catch (error) {
      console.error(`Failed to search ${searchType}:`, error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <SearchBarContainer>
      <SearchIcon />
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      {searchTerm && <ClearButton onClick={onClear} />}
    </SearchBarContainer>
  );
};

export default SearchBar;
