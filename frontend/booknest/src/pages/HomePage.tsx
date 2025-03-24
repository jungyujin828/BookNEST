<<<<<<< HEAD
// import React from 'react';
=======
import React from 'react';
import styled from '@emotion/styled';
import BestSeller from '../components/BestSeller';
import RegionalBooks from '../components/RegionalBooks';
>>>>>>> origin/frontend

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
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Header>
        <Title>북네스트</Title>
      </Header>
      <BestSeller />
      <RegionalBooks />
    </HomeContainer>
  );
};

export default HomePage; 