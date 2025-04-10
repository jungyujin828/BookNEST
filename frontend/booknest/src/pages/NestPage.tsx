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
  padding: 10px 18px;
  background-color: #00c473;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
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

  &::before {
    content: "+";
    margin-right: 6px;
    font-size: 18px;
    font-weight: 400;
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

      {showSearchModal && <BookSearchModal onClose={() => setShowSearchModal(false)} onBookAdded={handleBookAdded} />}

      {activeTab === "둥지" ? <NestBookList ref={nestBookListRef} /> : <BookmarkList />}
    </Container>
  );
};

export default NestPage;
