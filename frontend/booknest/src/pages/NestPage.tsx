import React, { useState, useRef } from "react";
import styled from "styled-components";
import NestBookList from "../components/NestBookList";
import BookmarkList from "../components/BookmarkList";
import BookSearchModal from "../components/BookSearchModal";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: ${(props) => (props.$active ? "#4a90e2" : "#666")};
  cursor: pointer;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${(props) => (props.$active ? "#4a90e2" : "transparent")};
  }

  &:hover {
    color: #4a90e2;
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    background-color: #357abd;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const NestPage = () => {
  const [activeTab, setActiveTab] = useState<"둥지" | "찜">("둥지");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const nestBookListRef = useRef<{ fetchNestBooks: () => void } | null>(null);

  const handleBookAdded = () => {
    if (nestBookListRef.current) {
      nestBookListRef.current.fetchNestBooks();
    }
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
        {activeTab === "둥지" && <AddButton onClick={() => setShowSearchModal(true)}>도서 추가</AddButton>}
      </HeaderSection>

      {showSearchModal && (
        <BookSearchModal 
          onClose={() => setShowSearchModal(false)} 
          onBookAdded={handleBookAdded}
        />
      )}

      {activeTab === "둥지" ? (
        <NestBookList ref={nestBookListRef} />
      ) : (
        <BookmarkList />
      )}
    </Container>
  );
};

export default NestPage;
