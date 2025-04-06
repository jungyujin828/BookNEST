import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import api from '../api/axios';
import { Review } from '../components/ReviewList';
import { useAuthStore } from '../store/useAuthStore';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const ReviewCard = styled.div<{ isUserReview?: boolean }>`
  padding: 16px;
  border: 1px solid ${props => props.isUserReview ? '#4CAF50' : '#dee2e6'};
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: ${props => props.isUserReview ? '#f8fff8' : '#fff'};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ReviewerName = styled.span`
  font-weight: bold;
  color: #495057;
`;

const ReviewDate = styled.span`
  color: #868e96;
  font-size: 14px;
`;

const ReviewContent = styled.div`
  margin-bottom: 8px;
  color: #495057;
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

  &:hover {
    color: #ff6b6b;
  }

  &.liked {
    color: #ff6b6b;
  }
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 16px 0;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface BookDetailResponse {
  success: boolean;
  data: {
    bookId: number;
    reviews: {
      content: Review[];
      pageNumber: number;
      totalPages: number;
      totalElements: number;
      pageSize: number;
      first: boolean;
      last: boolean;
    };
  };
}

const BookAllCommentPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { userDetail } = useAuthStore();
  const [likeLoading, setLikeLoading] = useState<{[key: number]: boolean}>({});

  const fetchReviews = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await api.get<BookDetailResponse>(`/api/book/${bookId}?page=${pageNum}&size=10`);
      
      if (response.data.success) {
        if (pageNum === 0) {
          setReviews(response.data.data.reviews.content);
        } else {
          setReviews(prev => [...prev, ...response.data.data.reviews.content]);
        }
        setHasMore(!response.data.data.reviews.last);
      }
    } catch (error) {
      console.error('리뷰 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(0);
  }, [bookId]);

  const handleLikeToggle = async (reviewId: number) => {
    if (!userDetail) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    
    if (likeLoading[reviewId]) return;
    
    setLikeLoading(prev => ({ ...prev, [reviewId]: true }));
    
    try {
      const review = reviews.find(r => r.reviewId === reviewId);
      if (!review) return;
      
      if (review.myLiked) {
        await api.delete(`/api/book/review/${reviewId}/like`);
      } else {
        await api.post(`/api/book/review/${reviewId}/like`);
      }
      
      // 리뷰 목록 새로고침
      fetchReviews(0);
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLikeLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchReviews(nextPage);
    }
  };

  return (
    <PageContainer>
      <PageTitle>전체 리뷰</PageTitle>
      {reviews.map((review) => {
        const isUserReview = userDetail?.userId === review.reviewerId;
        return (
          <ReviewCard key={review.reviewId} isUserReview={isUserReview}>
            <ReviewHeader>
              <ReviewInfo>
                <ReviewerName>{review.reviewerName}</ReviewerName>
                <ReviewDate>
                  {new Date(review.updatedAt).toLocaleDateString()}
                </ReviewDate>
              </ReviewInfo>
            </ReviewHeader>
            <ReviewContent>{review.content}</ReviewContent>
            <LikeButton 
              onClick={() => handleLikeToggle(review.reviewId)}
              className={review.myLiked ? 'liked' : ''}
              disabled={likeLoading[review.reviewId]}
            >
              {review.myLiked ? <FaHeart /> : <FaRegHeart />}
              <span>좋아요 {review.likes}개</span>
            </LikeButton>
          </ReviewCard>
        );
      })}
      {hasMore && (
        <LoadMoreButton 
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? '로딩 중...' : '더보기'}
        </LoadMoreButton>
      )}
    </PageContainer>
  );
};

export default BookAllCommentPage;
