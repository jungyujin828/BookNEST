import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaSearch, FaTimes, FaThLarge, FaList } from "react-icons/fa";
import NestBookList from "../components/NestBookList";
import BookmarkList from "../components/BookmarkList";
import BookSearchModal from "../components/BookSearchModal";
import { FaSort } from "react-icons/fa";

export type SortOption = "latest" | "oldest" | "rating" | "title";
export type ViewMode = "full" | "cover";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  flex-grow: 1;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? "600" : "normal")};
  color: ${(props) => (props.$active ? "#00c473" : "#666")};
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  border-radius: 4px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${(props) => (props.$active ? "#00c473" : "transparent")};
    border-radius: 3px;
  }

  &:hover {
    color: #00c473;
    background-color: ${(props) => (props.$active ? "transparent" : "rgba(0, 196, 115, 0.05)")};
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #00c473;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 196, 115, 0.2);

  &:hover {
    background-color: #00b368;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 196, 115, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 196, 115, 0.2);
  }

  svg {
    margin-right: 8px;
    font-size: 14px;
  }
`;

const SortContainer = styled.div`
  position: relative;
  margin-right: 16px;
`;

const SortButton = styled.button`
  padding: 8px 16px;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    margin-left: 8px;
  }
`;

const SortDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  width: 150px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  margin-top: 5px;
  overflow: hidden;
`;

const SortOption = styled.div<{ isActive: boolean }>`
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${(props) => (props.isActive ? "#f0f9f4" : "white")};
  color: ${(props) => (props.isActive ? "#00c473" : "#333")};
  font-weight: ${(props) => (props.isActive ? "600" : "normal")};

  &:hover {
    background-color: ${(props) => (props.isActive ? "#f0f9f4" : "#f8f8f8")};
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ViewModeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 16px;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    margin-right: 8px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  justify-content: space-between;
  background-color: white;
  padding: 5px;
  border-radius: 12px;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 8px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px;
  font-size: 16px;
  outline: none;
  
  &::placeholder {
    color: #aaa;
  }
`;

const SearchIcon = styled.div`
  color: #777;
  margin-right: 8px;
`;

const ClearButton = styled.button`
  border: none;
  background: none;
  color: #777;
  cursor: pointer;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }
`;

const getSortLabel = (sortOption: SortOption): string => {
  switch (sortOption) {
    case "latest":
      return "최신순";
    case "oldest":
      return "오래된순";
    case "rating":
      return "별점 높은순";
    case "title":
      return "제목순";
    default:
      return "정렬";
  }
};

const NestPage = () => {
  const [activeTab, setActiveTab] = useState<"둥지" | "찜">("둥지");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("full");
  const nestBookListRef = useRef<{ fetchNestBooks: () => void } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookAdded = () => {
    if (nestBookListRef.current) {
      nestBookListRef.current.fetchNestBooks();
    }
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setShowSortDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "full" ? "cover" : "full");
  };

  return (
    <Container>
      <HeaderSection>
        <TabContainer>
          <Tab $active={activeTab === "둥지"} onClick={() => setActiveTab("둥지")}>
            둥지
          </Tab>
          <Tab $active={activeTab === "찜"} onClick={() => setActiveTab("찜")}>
            찜
          </Tab>
        </TabContainer>
        <ActionContainer>
          {activeTab === "둥지" && (
            <>
              <ViewModeButton onClick={toggleViewMode}>
                {viewMode === "full" ? (
                  <>
                    <FaThLarge size={14} /> 표지만
                  </>
                ) : (
                  <>
                    <FaList size={14} /> 전체
                  </>
                )}
              </ViewModeButton>
              <SortContainer>
                <SortButton onClick={() => setShowSortDropdown(!showSortDropdown)}>
                  {getSortLabel(sortOption)} <FaSort />
                </SortButton>
                <SortDropdown isOpen={showSortDropdown}>
                  <SortOption isActive={sortOption === "latest"} onClick={() => handleSortChange("latest")}>
                    최신순
                  </SortOption>
                  <SortOption isActive={sortOption === "oldest"} onClick={() => handleSortChange("oldest")}>
                    오래된순
                  </SortOption>
                  <SortOption isActive={sortOption === "rating"} onClick={() => handleSortChange("rating")}>
                    별점 높은순
                  </SortOption>
                  <SortOption isActive={sortOption === "title"} onClick={() => handleSortChange("title")}>
                    제목순
                  </SortOption>
                </SortDropdown>
              </SortContainer>
              <AddButton onClick={() => setShowSearchModal(true)}>
                <FaPlus size={14} /> 도서추가
              </AddButton>
            </>
          )}
        </ActionContainer>
      </HeaderSection>

      {activeTab === "둥지" && (
        <SearchBarContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            placeholder="내 둥지 도서 검색" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <ClearButton 
            onClick={clearSearch}
          >
            <FaTimes size={16} />
          </ClearButton>
        </SearchBarContainer>
      )}

      {showSearchModal && <BookSearchModal onClose={() => setShowSearchModal(false)} onBookAdded={handleBookAdded} />}

      {activeTab === "둥지" ? (
        <NestBookList 
          ref={nestBookListRef} 
          sortOption={sortOption} 
          searchTerm={searchTerm}
          viewMode={viewMode}
        />
      ) : (
        <BookmarkList />
      )}
    </Container>
  );
};

export default NestPage;
