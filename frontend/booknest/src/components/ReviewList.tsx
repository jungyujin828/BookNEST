import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa';
import api from '../api/axios';
import CommentForm from './CommentForm';
import { useNavigate } from 'react-router-dom';

export interface Review {
  reviewId: number;
  reviewerId: number;
  bookId: number;
  content: string;
  reviewerName: string;
  likes: number;
  myLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsPage {
  content: Review[];
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  first: boolean;
  last: boolean;
}

interface ReviewListProps {
  bookId: number;
  reviews: ReviewsPage;
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

const ReviewPagination = styled.div`
  text-align: center;
  color: #6c757d;
  font-size: 14px;
  margin-top: 8px;
`;

// 모달 관련 스타일 추가
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #333;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const ModalButton = styled.button<{ isPrimary?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => props.isPrimary ? '#dc2626' : '#f1f3f5'};
  color: ${props => props.isPrimary ? 'white' : '#495057'};
  
  &:hover {
    background-color: ${props => props.isPrimary ? '#c41d1d' : '#e9ecef'};
  }
`;

const ReviewList: React.FC<ReviewListProps> = ({ bookId, reviews, onReviewChange, currentUserId }) => {
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [likedReviews, setLikedReviews] = useState<{[key: number]: boolean}>({});
  const [likeLoading, setLikeLoading] = useState<{[key: number]: boolean}>({});
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // 삭제 확인 모달 상태 추가
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  // 리뷰 정렬 - 내 리뷰를 최상단에, 나머지는 최신순
  const sortedReviews = [...reviews.content].sort((a, b) => {
    // 내 리뷰를 최상단으로
    if (currentUserId === a.reviewerName) return -1;
    if (currentUserId === b.reviewerName) return 1;
    // 나머지는 최신순으로
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // 리뷰 좋아요 상태를 로컬 스토리지에서 불러오기
  useEffect(() => {
    if (currentUserId) {
      const storedLikes = localStorage.getItem(`likedReviews_${currentUserId}`);
      setLikedReviews(storedLikes ? JSON.parse(storedLikes) : {});
    } else {
      setLikedReviews({});
    }
  }, [currentUserId]);

  // 리뷰 좋아요 상태를 로컬 스토리지에 저장
  const saveLikedReviews = (likedState: {[key: number]: boolean}) => {
    if (currentUserId) {
      localStorage.setItem(`likedReviews_${currentUserId}`, JSON.stringify(likedState));
    }
  };

  const handleCommentSubmit = async () => {
    onReviewChange();
    setEditingReviewId(null);
  };

  const handleCommentDelete = async (reviewId: number) => {
    try {
      const response = await api.delete(`/api/book/review/${reviewId}`);
      if (response.data.success) {
        onReviewChange();
        // 모달 닫기
        setShowDeleteModal(false);
        setReviewToDelete(null);
      } else {
        alert('리뷰 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('Delete API Error:', err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 삭제 모달 열기 함수
  const openDeleteModal = (reviewId: number) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  // 삭제 모달 닫기 함수
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
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
    
    if (likeLoading[reviewId]) return;
    
    setLikeLoading(prev => ({ ...prev, [reviewId]: true }));
    
    try {
      const review = reviews.content.find(r => r.reviewId === reviewId);
      if (!review) return;
      
      if (review.myLiked) {
        await api.delete(`/api/book/review/${reviewId}/like`);
      } else {
        await api.post(`/api/book/review/${reviewId}/like`);
      }
      
      onReviewChange();
    } catch (err) {
      console.error('Like API Error:', err);
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLikeLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const loadMoreReviews = async () => {
    if (reviews.totalElements > 5) {
      // BookAllCommentPage로 이동
      navigate(`/book/${bookId}/comments`);
    } else {
      // 기존의 더보기 로직 실행
      if (reviewsLoading || reviews.last) return;
      
      try {
        setReviewsLoading(true);
        const nextPage = reviews.pageNumber + 1;
        const response = await api.get(`/api/book/${bookId}?page=${nextPage}&size=5`);
        
        if (response.data.success) {
          onReviewChange();
          setCurrentPage(nextPage);
        }
      } catch (err) {
        console.error("Failed to load more reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    }
  };

  return (
    <ReviewSection>
      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>한줄평 삭제</ModalTitle>
            <p>정말로 이 한줄평을 삭제하시겠습니까?</p>
            <ModalButtons>
              <ModalButton onClick={closeDeleteModal}>취소</ModalButton>
              <ModalButton 
                isPrimary 
                onClick={() => reviewToDelete && handleCommentDelete(reviewToDelete)}
              >
                삭제
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {sortedReviews.length > 0 ? (
        <>
          {sortedReviews.map((review) => {
            const isUserReview = currentUserId === review.reviewerName;
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
                {editingReviewId === review.reviewId ? (
                  <CommentForm 
                    bookId={bookId}
                    reviewId={review.reviewId}
                    initialContent={review.content}
                    isEdit={true}
                    onCommentSubmit={handleCommentSubmit}
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
                            onClick={() => openDeleteModal(review.reviewId)}
                          >
                            삭제
                          </ActionButton>
                        </ReviewActions>
                      )}
                    </ReviewContent>
                    <LikeButton 
                      onClick={() => handleLikeToggle(review.reviewId)}
                      className={review.myLiked ? 'liked' : ''}
                      disabled={likeLoading[review.reviewId]}
                    >
                      {review.myLiked ? <FaHeart /> : <FaRegHeart />}
                      <span>좋아요 {review.likes}개</span>
                    </LikeButton>
                  </>
                )}
              </ReviewCard>
            );
          })}
          
          {(!reviews.last || reviews.totalElements > 5) && (
            <LoadMoreButton 
              onClick={loadMoreReviews}
              disabled={reviewsLoading}
            >
              {reviewsLoading ? '로딩 중...' : reviews.totalElements > 5 ? '전체 한줄평 보기' : '더보기'}
            </LoadMoreButton>
          )}
          
          <ReviewPagination>
            <span>총 {reviews.totalElements}개의 한줄평 중 {sortedReviews.length}개 표시 중</span>
          </ReviewPagination>
        </>
      ) : (
        <EmptyReviews>아직 작성된 한줄평이 없습니다.</EmptyReviews>
      )}
    </ReviewSection>
  );
};

export default ReviewList; 