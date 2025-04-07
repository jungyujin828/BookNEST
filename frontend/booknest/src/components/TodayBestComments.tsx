import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface BestReview {
  reviewId: number;
  bookId: number;
  reviewerName: string;
  content: string;
  myLiked: boolean;
  totalLikes: number;
  todayLikes: number;
  rank: number;
  createdAt: string;
  updatedAt: string;
  bookTitle?: string;
}

const Container = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewAllLink = styled.span`
  font-size: 14px;
  color: #666;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ReviewCard = styled.div`
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: #fff;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ReviewerName = styled.span`
  font-weight: bold;
  color: #495057;
`;

const RankBadge = styled.span<{ rank: number }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${props => {
    switch (props.rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#6c757d';
    }
  }};
`;

const ReviewContent = styled.p`
  margin: 12px 0;
  color: #495057;
  font-size: 16px;
  line-height: 1.5;
`;

const LikeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #868e96;
  font-size: 14px;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #868e96;
  font-size: 14px;
  transition: color 0.2s;
  z-index: 1;

  &:hover {
    color: #ff6b6b;
  }

  &.liked {
    color: #ff6b6b;
  }
`;

const BookTitle = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 4px;
`;

const TodayBestComments: React.FC = () => {
  const navigate = useNavigate();
  const [bestReviews, setBestReviews] = useState<BestReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState<{[key: number]: boolean}>({});

  const fetchBestReviews = async () => {
    try {
      const response = await api.get('/api/book/best-reviews');
      if (response.data.success) {
        const reviewsWithBookTitles = await Promise.all(
          response.data.data.map(async (review: BestReview) => {
            try {
              const bookResponse = await api.get(`/api/book/${review.bookId}`);
              if (bookResponse.data.success) {
                return {
                  ...review,
                  bookTitle: bookResponse.data.data.title
                };
              }
              return review;
            } catch (error) {
              console.error(`책 정보 로딩 실패 (ID: ${review.bookId}):`, error);
              return review;
            }
          })
        );
        setBestReviews(reviewsWithBookTitles);
      }
    } catch (error) {
      console.error('베스트 리뷰 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestReviews();
  }, []);

  const handleLikeToggle = async (reviewId: number) => {
    if (likeLoading[reviewId]) return;
    
    setLikeLoading(prev => ({ ...prev, [reviewId]: true }));
    
    try {
      const review = bestReviews.find(r => r.reviewId === reviewId);
      if (!review) return;
      
      if (review.myLiked) {
        await api.delete(`/api/book/review/${reviewId}/like`);
      } else {
        await api.post(`/api/book/review/${reviewId}/like`);
      }
      
      // 리뷰 목록 새로고침
      fetchBestReviews();
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLikeLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleReviewClick = (bookId: number, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/book-detail/${bookId}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <Title>
        오늘의 BEST 한줄평
      </Title>
      {bestReviews.map((review) => (
        <ReviewCard 
          key={review.reviewId}
          onClick={(e) => handleReviewClick(review.bookId, e)}
        >
          <ReviewHeader>
            <ReviewerInfo>
              <ReviewerName>{review.reviewerName}</ReviewerName>
              <RankBadge rank={review.rank}>{review.rank}위</RankBadge>
              {review.bookTitle && <BookTitle>『{review.bookTitle}』</BookTitle>}
            </ReviewerInfo>
          </ReviewHeader>
          <ReviewContent>{review.content}</ReviewContent>
          <LikeInfo>
            <LikeButton 
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle(review.reviewId);
              }}
              className={review.myLiked ? 'liked' : ''}
              disabled={likeLoading[review.reviewId]}
            >
              {review.myLiked ? <FaHeart /> : <FaRegHeart />}
              <span>좋아요 {review.totalLikes}개</span>
            </LikeButton>
            <span>(오늘 +{review.todayLikes})</span>
          </LikeInfo>
        </ReviewCard>
      ))}
    </Container>
  );
};

export default TodayBestComments; 