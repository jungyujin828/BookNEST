import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin: 0 16px;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TitleText = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const ViewAllButton = styled.button`
  color: #666;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  
  &:hover {
    color: #333;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex-grow: 1;
`;

const CommentText = styled.p`
  font-size: 15px;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.5;
  font-weight: bold;
`;

const BookInfo = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
`;

const Star = styled.span`
  color: #ffd700;
`;

const CommentMeta = styled.div`
  flex-shrink: 0;
  text-align: right;
  font-size: 12px;
  color: #666;
`;

// 임시 데이터
const mockComments = [
  {
    id: 1,
    text: '"우리는 행복하지만, 이 행복의 근원을 모른다는 것"',
    book: '우리가 빛의 속도로 갈 수 없다면 | 김초엽',
    rating: 5,
    category: '작업실 이야기'
  },
  {
    id: 2,
    text: '이게 뭔 소리야',
    book: '아트테라피 | 앤디 워홀',
    rating: 4,
    category: '작업실 노하우'
  },
  {
    id: 3,
    text: '욕심의 끝은 결국 파멸로 귀결된다.',
    book: '다잉 아이(Dying Eye) | 무라카미 류',
    rating: 4,
    category: '노송지대 노하우'
  }
];

const TodayBestComments = () => {
  return (
    <Container>
      <Title>
        <TitleText>오늘의 BEST 한줄평</TitleText>
        <ViewAllButton>전체보기</ViewAllButton>
      </Title>
      <CommentList>
        {mockComments.map((comment) => (
          <CommentItem key={comment.id}>
            <UserAvatar />
            <CommentContent>
              <RatingContainer>
                {Array.from({ length: comment.rating }).map((_, index) => (
                  <Star key={index}>★</Star>
                ))}
              </RatingContainer>
              <CommentText>{comment.text}</CommentText>
              <BookInfo>{comment.book}</BookInfo>
            </CommentContent>
            <CommentMeta>
              {comment.category}
            </CommentMeta>
          </CommentItem>
        ))}
      </CommentList>
    </Container>
  );
};

export default TodayBestComments; 