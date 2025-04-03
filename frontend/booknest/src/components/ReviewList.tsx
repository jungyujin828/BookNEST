import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../api/axios';
import CommentForm from './CommentForm';

interface Review {
  reviewId: number;
  reviewerName: string;
  reviewerId: number;
  content: string;
  likes: number;
  createdAt: string;
}

interface ReviewListProps {
  bookId: number;
  reviews: Review[];
  onReviewChange: () => void;
  currentUserId: string | null;
}

const ReviewSection = styled.div`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
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

const ReviewContent = styled.div`
  margin-bottom: 8px;
  color: #495057;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const ReviewText = styled.span`
  flex: 1;
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: #e9ecef;
  color: #495057;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dee2e6;
  }

  &.delete {
    background-color: #fee2e2;
    color: #dc2626;

    &:hover {
      background-color: #fecaca;
    }
  }
`;

const ReviewerName = styled.span`
  font-weight: bold;
  color: #495057;
`;

const ReviewDate = styled.span`
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

  &:hover {
    color: #ff6b6b;
  }

  &.liked {
    color: #ff6b6b;
  }
`;

const EmptyReviews = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ReviewList: React.FC<ReviewListProps> = ({ bookId, reviews, onReviewChange, currentUserId }) => {
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [likedReviews, setLikedReviews] = useState<{[key: number]: boolean}>({});
  const [likeLoading, setLikeLoading] = useState<{[key: number]: boolean}>({});

  // 리뷰 좋아요 상태를 로컬 스토리지에서 불러오기
  const loadLikedReviews = () => {
    try {
      if (!currentUserId) return {};
      
      const storedLikes = localStorage.getItem(`likedReviews_${currentUserId}`);
      return storedLikes ? JSON.parse(storedLikes) : {};
    } catch (err) {
      console.error('Failed to load liked reviews from localStorage:', err);
      return {};
    }
  };

  // 리뷰 좋아요 상태를 로컬 스토리지에 저장
  const saveLikedReviews = (likedState: {[key: number]: boolean}) => {
    try {
      if (!currentUserId) return;
      
      localStorage.setItem(`likedReviews_${currentUserId}`, JSON.stringify(likedState));
    } catch (err) {
      console.error('Failed to save liked reviews to localStorage:', err);
    }
  };

  // 현재 사용자 ID가 변경될 때 좋아요 상태 불러오기
  useEffect(() => {
    if (currentUserId) {
      setLikedReviews(loadLikedReviews());
    } else {
      setLikedReviews({});
    }
  }, [currentUserId]);

  const handleCommentSubmit = async () => {
    onReviewChange();
    setEditingReviewId(null);
  };

  const handleCommentDelete = async (reviewId: number) => {
    try {
      const response = await api.delete(`/api/book/review/${reviewId}`);
      if (response.data.success) {
        // 삭제 성공 후 목록 새로고침
        onReviewChange();
      } else {
        alert('리뷰 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('Delete API Error:', err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleEditClick = (reviewId: number) => {
    setEditingReviewId(reviewId);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const handleLikeToggle = async (reviewId: number) => {
    if (!currentUserId) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    
    // 좋아요 상태를 위한 로딩 설정
    setLikeLoading(prev => ({ ...prev, [reviewId]: true }));
    
    try {
      const isCurrentlyLiked = likedReviews[reviewId];
      
      try {
        if (isCurrentlyLiked) {
          // 좋아요 취소 (DELETE 요청)
          await api.delete(`/api/book/review/${reviewId}/like`);
        } else {
          // 좋아요 추가 (POST 요청)
          await api.post(`/api/book/review/${reviewId}/like`);
        }
        
        // 상태 업데이트
        const updatedLikes = { 
          ...likedReviews, 
          [reviewId]: !isCurrentlyLiked 
        };
        
        setLikedReviews(updatedLikes);
        
        // 로컬 스토리지에 저장
        saveLikedReviews(updatedLikes);
        
        // 리뷰 갱신
        onReviewChange();
      } catch (apiError) {
        console.error('API 요청 실패:', apiError);
        
        // API 에러 발생해도 로컬에서는 좋아요 처리
        // (네트워크 문제 등으로 API 실패해도 UX 개선)
        const updatedLikes = { 
          ...likedReviews, 
          [reviewId]: !isCurrentlyLiked 
        };
        
        setLikedReviews(updatedLikes);
        saveLikedReviews(updatedLikes);
        
        // 부모 컴포넌트에 알려 리뷰 업데이트
        onReviewChange();
      }
    } catch (err) {
      console.error('Like API Error:', err);
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLikeLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    // 현재 사용자의 리뷰를 맨 위로
    if (currentUserId && currentUserId === a.reviewerName) return -1;
    if (currentUserId && currentUserId === b.reviewerName) return 1;
    // 그 다음 최신순으로 정렬
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <ReviewSection>
      <SectionTitle>리뷰</SectionTitle>
      {sortedReviews.length > 0 ? (
        sortedReviews.map((review) => {
          const isUserReview = currentUserId !== undefined && currentUserId !== null && currentUserId === review.reviewerName;
          return (
            <ReviewCard key={review.reviewId} isUserReview={isUserReview}>
              <ReviewHeader>
                <ReviewInfo>
                  <ReviewerName>{review.reviewerName}</ReviewerName>
                  <ReviewDate>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </ReviewDate>
                </ReviewInfo>
              </ReviewHeader>
              {editingReviewId === review.reviewId ? (
                <CommentForm 
                  bookId={bookId}
                  reviewId={review.reviewId}
                  initialContent={review.content}
                  isEdit={true}
                  onCommentSubmit={handleCommentSubmit}
                  onCommentDelete={handleCommentDelete}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <>
                  <ReviewContent>
                    <ReviewText>{review.content}</ReviewText>
                    {isUserReview && (
                      <ReviewActions>
                        <ActionButton onClick={() => handleEditClick(review.reviewId)}>
                          수정
                        </ActionButton>
                        <ActionButton 
                          className="delete"
                          onClick={() => {
                            if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
                              handleCommentDelete(review.reviewId);
                            }
                          }}
                        >
                          삭제
                        </ActionButton>
                      </ReviewActions>
                    )}
                  </ReviewContent>
                  <LikeButton 
                    onClick={() => handleLikeToggle(review.reviewId)}
                    className={likedReviews[review.reviewId] ? 'liked' : ''}
                    disabled={likeLoading[review.reviewId]}
                  >
                    {likedReviews[review.reviewId] ? <FaHeart /> : <FaRegHeart />}
                    <span>좋아요 {review.likes}개</span>
                  </LikeButton>
                </>
              )}
            </ReviewCard>
          );
        })
      ) : (
        <EmptyReviews>아직 작성된 리뷰가 없습니다.</EmptyReviews>
      )}
    </ReviewSection>
  );
};

export default ReviewList; 