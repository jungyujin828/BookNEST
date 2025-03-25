import React from 'react';
import styled from '@emotion/styled';
import BestSeller from '../components/BestSeller';
import RegionalBooks from '../components/RegionalBooks';
import AuthorBook from '../components/AuthorBook';
import AgeBooks from '../components/AgeBooks';
import CriticBooks from '../components/CriticBooks';
import AuthorRatingBooks from '../components/AuthorRatingBooks';
import TodayBestComments from '../components/TodayBestComments';

const PageWrapper = styled.div`
  height: 100vh;
  overflow-y: auto;
  
  /* Firefox */
  scrollbar-width: none;
  
  /* Chrome, Safari, Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* IE, Edge */
  -ms-overflow-style: none;
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 0;
  
  @media (min-width: 768px) {
    gap: 32px;
    padding: 24px 0;
  }
`;

const Header = styled.header`
  background-color: #69b578;
  color: white;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  color: #4CAF50;
`;

const HomePage = () => {
  return (
    <PageWrapper>
      <HomeContainer>
        <TodayBestComments />
        <BestSeller />
        <RegionalBooks />
        <AuthorBook />
        <AgeBooks />
        <CriticBooks />
        <AuthorRatingBooks />
      </HomeContainer>
    </PageWrapper>
  );
};

export default HomePage; 