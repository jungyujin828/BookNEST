import React from "react";
import styled from "@emotion/styled";
import { useRecentStore } from "../store/useRecentStore";

interface SearchRecentProps {
  onSelect: (query: string) => void;
  onClose: () => void;
}

const SearchRecentContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 8px;
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    font-size: 16px;
    margin: 0;
    color: #333;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const SearchItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TimeIcon = styled.span`
  color: #666;
  margin-right: 12px;
  font-size: 16px;
`;

const QueryText = styled.span`
  flex: 1;
  color: #333;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: #333;
  }
`;

const SearchRecent: React.FC<SearchRecentProps> = ({ onSelect, onClose }) => {
  const { recentSearches, removeRecent, clearRecent } = useRecentStore();

  const handleSelect = (query: string) => {
    onSelect(query);
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    removeRecent(query);
  };

  // Get the last 5 recent searches to display
  const displayedSearches = recentSearches.slice(0, 5);

  return (
    <SearchRecentContainer>
      <Title>
        <h3>최근 검색어</h3>
        {recentSearches.length > 0 && (
          <ClearButton onClick={clearRecent}>모두 삭제</ClearButton>
        )}
      </Title>

      {displayedSearches.map((item) => (
        <SearchItem
          key={item.timestamp}
          onClick={() => handleSelect(item.query)}
        >
          <TimeIcon>⏱</TimeIcon>
          <QueryText>{item.query}</QueryText>
          <DeleteButton onClick={(e) => handleDelete(e, item.query)}>
            ×
          </DeleteButton>
        </SearchItem>
      ))}
    </SearchRecentContainer>
  );
};

export default SearchRecent;
