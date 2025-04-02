import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api/axios';

interface Review {
  reviewerId: number;
  bookId: number;
  reviewId: number;
  review: string;
  bookName: string;
  authors: string[];
}

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const BookTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Authors = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;

const ReviewText = styled.p`
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  margin: 0;
`;

const MyCommentPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/api/book/review');
        if (response.data.success) {
          setReviews(response.data.data);
        } else {
          setError('리뷰를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setError('리뷰를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <Container>로딩 중...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  return (
    <Container>
      <PageTitle>내가 쓴 한줄평</PageTitle>
      <ReviewList>
        {reviews.map((review) => (
          <ReviewCard key={review.reviewId}>
            <BookTitle>{review.bookName}</BookTitle>
            <Authors>{review.authors.join(', ')}</Authors>
            <ReviewText>"{review.review}"</ReviewText>
          </ReviewCard>
        ))}
      </ReviewList>
    </Container>
  );
};

export default MyCommentPage;
