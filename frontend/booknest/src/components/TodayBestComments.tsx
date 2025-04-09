import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { FaHeart, FaRegHeart, FaCaretUp } from 'react-icons/fa';
import { RiMedalFill, RiMedalLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface BestReview {
  reviewId: number;
  bookId: number;
  bookName: string;
  reviewerName: string;
  reviewerProfileUrl: string;
  content: string;
  myLiked: boolean;
  totalLikes: number;
  todayLikes: number;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

const Container = styled.div`
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReviewCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  background-color: #fff;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-right: 100px;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const RankBadge = styled.div<{ rank: number }>`
  margin-right: 8px;
  color: ${props => {
    switch (props.rank) {
      case 1: return '#FFB800';
      case 2: return '#A3A3A3';
      case 3: return '#C77B30';
      default: return '#6c757d';
    }
  }};
  font-size: 24px;
  display: flex;
  align-items: center;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #1a1a1a;
`;

const ReviewContent = styled.p`
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: -0.3px;
`;

const BookInfo = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const BookTitle = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const InteractionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const LikeButton = styled.button<{ isLiked: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.isLiked ? '#ff4b4b' : '#868e96'};
  font-size: 16px;
  transition: all 0.2s ease;
  padding: 4px 8px;

  &:hover {
    opacity: 0.8;
  }

  svg {
    font-size:16px;
  }
`;

const TodayLikes = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #00c473;
  font-size: 16px;
  padding: 4px 8px;
  opacity: 0.8;
  
  svg {
    font-size: 22px;
    height: 38px;
    width: 18px;
    transform: scaleY(1.3);
  }
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
        setBestReviews(response.data.data);
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <RiMedalFill />;
      case 2:
        return <RiMedalFill />;
      case 3:
        return <RiMedalFill />;
      default:
        return <RiMedalLine />;
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <Title>오늘의 BEST 한줄평</Title>
      {bestReviews.map((review) => (
        <ReviewCard 
          key={review.reviewId}
          onClick={(e) => handleReviewClick(review.bookId, e)}
        >
          <InteractionBar>
            <LikeButton 
              isLiked={review.myLiked}
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle(review.reviewId);
              }}
              disabled={likeLoading[review.reviewId]}
            >
              {review.myLiked ? <FaHeart /> : <FaRegHeart />}
              {review.totalLikes}
            </LikeButton>
            {review.todayLikes > 0 && (
              <TodayLikes>
                <FaCaretUp />
                {review.todayLikes}
              </TodayLikes>
            )}
          </InteractionBar>
          <ReviewHeader>
            <RankBadge rank={review.rank}>
              {getRankIcon(review.rank)}
            </RankBadge>
            <UserProfile>
              <ProfileImage 
                src={review.reviewerProfileUrl || '/default-profile.png'} 
                alt={review.reviewerName} 
              />
              <ReviewerName>{review.reviewerName}</ReviewerName>
            </UserProfile>
          </ReviewHeader>
          
          <ReviewContent>{review.content}</ReviewContent>
          
          <BookInfo>
            <BookTitle>『{review.bookName}』</BookTitle>
          </BookInfo>
        </ReviewCard>
      ))}
    </Container>
  );
};

export default TodayBestComments; 