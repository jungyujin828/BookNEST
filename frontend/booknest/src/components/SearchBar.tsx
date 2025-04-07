import styled from "@emotion/styled";
import api from "../api/axios";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useRecentStore } from "../store/useRecentStore";
import SearchRecent from "./SearchRecent";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  searchType: "books" | "users";
  onSearchResult: (data: any) => void;
  selectedTags?: string[];
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchBarContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
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

const SearchButton = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  background-color: #7bc47f;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6ab36e;
  }
`;

const SearchBar = forwardRef<any, SearchBarProps>(
  (
    {
      searchTerm,
      onSearchChange,
      onClear,
      placeholder = "도서, 작가, 유저 검색",
      searchType,
      onSearchResult,
      selectedTags,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const { addRecent } = useRecentStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
      if (!searchTerm.trim()) return;
      
      setIsSearching(true);
      if (searchTerm.trim()) {
        addRecent(searchTerm);
      }
      try {
        const endpoint =
          searchType === "books" ? "/api/search/book" : "/api/search/user";
        const params =
          searchType === "books"
            ? {
                title: searchTerm,
                tags: selectedTags?.join(","),
                page: 1,
                size: 10,
              }
            : { name: searchTerm, page: 1, size: 10 };

        const response = await api.get(endpoint, {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          const processedData = {
            ...response.data.data,
            content: response.data.data.content.map((item: any) => ({
              ...item,
              tags:
                item.tags?.filter(
                  (tag: string) => tag !== "_tagsparsefailure"
                ) || [],
            })),
          };
          onSearchResult(processedData.content);
        }
      } catch (error) {
        console.error(`Failed to search ${searchType}:`, error);
      } finally {
        setIsSearching(false);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus();
      }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur();
      }
    };

    useImperativeHandle(ref, () => ({
      handleSearch,
    }));

    return (
      <SearchBarContainer>
        <SearchInputWrapper>
          <SearchIcon />
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {searchTerm && <ClearButton onClick={onClear} />}
        </SearchInputWrapper>
        <SearchButton 
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? "검색 중..." : "검색"}
        </SearchButton>
      </SearchBarContainer>
    );
  }
);

export default SearchBar;
