import React, { useState } from "react";
import styled from "styled-components";
// import NestBookList from "../components/NestBookList";

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
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  color: ${props => props.$active ? '#4a90e2' : '#666'};
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.$active ? '#4a90e2' : 'transparent'};
  }

  &:hover {
    color: #4a90e2;
  }
`;

const NestPage = () => {
  const [activeTab, setActiveTab] = useState<'둥지' | '찜'>('둥지');

  return (
    <Container>
      <TabContainer>
        <Tab 
          $active={activeTab === '둥지'} 
          onClick={() => setActiveTab('둥지')}
        >
          둥지
        </Tab>
        <Tab 
          $active={activeTab === '찜'} 
          onClick={() => setActiveTab('찜')}
        >
          찜
        </Tab>
      </TabContainer>

      {activeTab === '둥지' ? (
        // <NestBookList />
        ''
      ) : (
        <div>찜 목록 (준비 중)</div>
      )}
    </Container>
  );
};

export default NestPage;
