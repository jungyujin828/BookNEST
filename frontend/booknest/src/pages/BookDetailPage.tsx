import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import axios from "axios";
import api from "../api/axios";
import PurchaseModal from "../components/PurchaseModal";
import CommentForm from "../components/CommentForm";
import RatingStars from "../components/RatingStars";
import { useBookStore } from "../store/useBookStore";
import useRatingStore from "../store/useRatingStore";
import BookmarkButton from "../components/BookmarkButton";
import AddToNestButton from "../components/AddToNestButton";
import ReviewList from "../components/ReviewList";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface Review {
  reviewId: number;
  rating: number;
  reviewerName: string;
  content: string;
  myLiked: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsPage {
  content: Review[];
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  first: boolean;
  last: boolean;
}

interface BookDetail {
  bookId: number;
  isBookMarked: boolean;
  avgRating: number;
  title: string;
  publishedDate: string;
  isbn: string;
  publisher: string;
  pages: number;
  imageUrl: string;
  intro: string;
  index: string;
  publisherReview: string;
  authors: string[];
  tags: string[];
  categories: string[];
  reviews: ReviewsPage;
}

interface PurchaseUrls {
  aladinUrl: string;
  kyoboUrl: string;
  yes24Url: string;
}

interface LibraryBook {
  libraryName: string;
  availability: string;
  link: string;
}

interface UserInfo {
  userId: number;
  nickname: string;
  gender: string | null;
  birthDate: string | null;
  roadAddress: string;
  zipcode: string;
  followers: number;
  followings: number;
  totalRatings: number;
  totalReviews: number;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const ImageSection = styled.div`
  flex: 0 0 300px;

  @media (max-width: 768px) {
    flex: none;
    text-align: center;
  }
`;

const BookImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InfoSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 16px;
  color: #333;
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RatingLabel = styled.span`
  font-size: 16px;
  color: #666;
  min-width: 80px;
`;

const RatingText = styled.span`
  font-size: 20px;
  color: #333;
`;

const AuthorInfo = styled.div`
  margin-bottom: 16px;
  color: #666;
`;

const BasicInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 14px;
  color: #666;
`;

const Value = styled.span`
  font-size: 16px;
  color: #333;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const Tag = styled.span`
  padding: 4px 12px;
  background-color: #e9ecef;
  border-radius: 16px;
  font-size: 14px;
  color: #495057;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  padding: 1rem 0;
  display: block;
  margin-left: auto;

  &:hover {
    text-decoration: underline;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
`;

const Content = styled.p<{ isExpanded?: boolean }>`
  line-height: 1.6;
  color: #495057;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.isExpanded ? "none" : "3")};
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #dc3545;
  background-color: #fff3f3;
  border-radius: 8px;
  margin: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

const PurchaseButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    background-color: #3d8b40;
  }
`;

const BookHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BookTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ReviewSection = styled.div`
  margin-top: 40px;
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

const ReviewRating = styled.span`
  color: #f59f00;
  font-weight: bold;
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

const BookDetailPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [likeLoading, setLikeLoading] = useState<{ [key: number]: boolean }>({});

  // Zustand store
  const {
    purchaseUrls,
    loading: storeLoading,
    error: storeError,
    setPurchaseUrls,
    setLoading: setStoreLoading,
    setError: setStoreError,
  } = useBookStore();

  // 모달 상태
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { userRatings } = useRatingStore();

  useEffect(() => {
    const fetchBookDetail = async (page = 1) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/book/${bookId}?page=${page}&size=5`);

        if (response.data.success) {
          const bookData = response.data.data;
          setBook(bookData);
        } else {
          setError("도서 정보를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetail();
    }
  }, [bookId]);

  // 다음 페이지 리뷰 불러오기
  const loadMoreReviews = async () => {
    if (!book || reviewsLoading || book.reviews.last) return;
    
    try {
      setReviewsLoading(true);
      const nextPage = book.reviews.pageNumber + 1;
      const response = await api.get(`/api/book/${bookId}?page=${nextPage}&size=5`);
      
      if (response.data.success) {
        setBook(prev => {
          if (!prev) return null;
          
          // 기존 리뷰와 새로운 리뷰 합치기
          const updatedReviews = {
            ...response.data.data.reviews,
            content: [...prev.reviews.content, ...response.data.data.reviews.content]
          };
          
          return {
            ...prev,
            reviews: updatedReviews
          };
        });
        
        setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error("Failed to load more reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get<{ success: boolean; data: UserInfo; error: null }>("/api/user/info");
        if (response.data.success && response.data.data) {
          // nickname으로 사용자 식별
          const nickname = response.data.data.nickname;
          setCurrentUserId(nickname);
        } else {
          setCurrentUserId(null);
        }
      } catch (err) {
        // 403 에러는 로그인하지 않은 상태이므로 무시
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 403) {
            setCurrentUserId(null);
          } else {
            console.error("Failed to fetch current user:", err);
            setCurrentUserId(null);
          }
        }
      }
    };
    fetchCurrentUser();
  }, []);

  const handlePurchaseClick = async () => {
    try {
      setStoreLoading("purchaseUrls", true);
      setStoreError("purchaseUrls", null);
      setIsPurchaseModalOpen(true);

      const response = await api.get(`/api/book/${bookId}/purchase`);

      if (response.data.success) {
        setPurchaseUrls(response.data.data);
      } else {
        setStoreError("purchaseUrls", "구매 링크를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("Purchase API Error:", err);
      setStoreError("purchaseUrls", "서버 오류가 발생했습니다.");
    } finally {
      setStoreLoading("purchaseUrls", false);
    }
  };

  const handlePurchaseModalClose = () => {
    setIsPurchaseModalOpen(false);
    setPurchaseUrls(null);
  };

  const handleCommentSubmit = async () => {
    try {
      // 리뷰 작성/수정 후 리뷰 목록 새로고침
      const response = await api.get(`/api/book/${bookId}?page=1&size=5`);
      
      if (response.data.success) {
        setBook(response.data.data);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Book API Error:", err);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    try {
      setBook((prevBook) => {
        if (!prevBook) return null;
        return {
          ...prevBook,
          avgRating: newRating,
        };
      });
    } catch (err) {
      console.error("Error updating rating:", err);
      setError("평점 업데이트에 실패했습니다.");
    }
  };

  // 리뷰 삭제 핸들러
  const handleReviewDelete = async (reviewId: number) => {
    try {
      const response = await api.delete(`/api/book/review/${reviewId}`);
      if (response.data.success) {
        // 성공적으로 삭제되면 책 데이터 다시 불러오기
        handleCommentSubmit();
      } else {
        alert('리뷰 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('Delete API Error:', err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 리뷰 수정 핸들러
  const handleEditClick = (reviewId: number) => {
    setEditingReviewId(reviewId);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (reviewId: number) => {
    if (!currentUserId) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    
    // 이미 로딩 중이면 무시
    if (likeLoading[reviewId]) return;
    
    setLikeLoading(prev => ({ ...prev, [reviewId]: true }));
    
    try {
      // 현재 리뷰 찾기
      const review = book?.reviews.content.find(r => r.reviewId === reviewId);
      if (!review) return;
      
      // 좋아요 상태에 따라 API 요청
      if (review.myLiked) {
        // 좋아요 취소
        await api.delete(`/api/book/review/${reviewId}/like`);
      } else {
        // 좋아요 추가
        await api.post(`/api/book/review/${reviewId}/like`);
      }
      
      // 임시로 UI 업데이트
      setBook(prev => {
        if (!prev) return null;
        
        const updatedReviews = {
          ...prev.reviews,
          content: prev.reviews.content.map(r => {
            if (r.reviewId === reviewId) {
              return {
                ...r,
                myLiked: !r.myLiked,
                likes: r.myLiked ? r.likes - 1 : r.likes + 1
              };
            }
            return r;
          })
        };
        
        return {
          ...prev,
          reviews: updatedReviews
        };
      });
      
      // 백그라운드에서 최신 데이터 가져오기
      const response = await api.get(`/api/book/${bookId}?page=${currentPage}&size=5`);
      if (response.data.success) {
        // 현재 화면에 보이는 리뷰들의 ID 목록
        const currentReviewIds = book?.reviews.content.map(r => r.reviewId) || [];
        
        // 새로 가져온 리뷰 중에서 현재 화면에 보이는 리뷰만 업데이트
        const updatedReviews = {
          ...response.data.data.reviews,
          content: response.data.data.reviews.content.filter(
            r => currentReviewIds.includes(r.reviewId)
          )
        };
        
        if (updatedReviews.content.length > 0) {
          setBook(prev => {
            if (!prev) return null;
            
            return {
              ...prev,
              reviews: {
                ...prev.reviews,
                content: prev.reviews.content.map(r => {
                  // 새로 가져온 데이터에서 같은 ID를 가진 리뷰 찾기
                  const updatedReview = updatedReviews.content.find(
                    ur => ur.reviewId === r.reviewId
                  );
                  
                  // 새 데이터가 있으면 업데이트, 없으면 기존 데이터 유지
                  return updatedReview || r;
                })
              }
            };
          });
        }
      }
    } catch (err) {
      console.error('Like API Error:', err);
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLikeLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  if (loading) {
    return <LoadingMessage>도서 정보를 불러오는 중...</LoadingMessage>;
  }

  if (error || !book) {
    return <ErrorMessage>{error || "도서 정보를 찾을 수 없습니다."}</ErrorMessage>;
  }

  return (
    <Container>
      {book && (
        <>
          <BookHeader>
            <BookTitle>{book.title}</BookTitle>
            <BookmarkButton bookId={book.bookId} />
          </BookHeader>
          <TopSection>
            <ImageSection>
              <BookImage src={book.imageUrl} alt={book.title} />
              <ButtonContainer>
                <AddToNestButton bookId={book.bookId} currentRating={userRatings[book.bookId] || 0} />
                <PurchaseButton onClick={handlePurchaseClick}>구매하기</PurchaseButton>
              </ButtonContainer>
            </ImageSection>
            <InfoSection>
              <Title>{book.title}</Title>
              <RatingContainer>
                <RatingRow>
                  <RatingLabel>평균 평점</RatingLabel>
                  <RatingText>{book.avgRating.toFixed(1)}</RatingText>
                </RatingRow>
                <RatingRow>
                  <RatingLabel>내 평점</RatingLabel>
                  <RatingStars bookId={book.bookId} onRatingChange={handleRatingChange} />
                  <RatingText>{userRatings[book.bookId]?.toFixed(1) || "0.0"}</RatingText>
                </RatingRow>
              </RatingContainer>
              <AuthorInfo>저자: {book.authors.join(", ")}</AuthorInfo>
              <BasicInfo>
                <InfoItem>
                  <Label>출판사</Label>
                  <Value>{book.publisher}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>출판일</Label>
                  <Value>{book.publishedDate}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>ISBN</Label>
                  <Value>{book.isbn}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>페이지</Label>
                  <Value>{book.pages}쪽</Value>
                </InfoItem>
              </BasicInfo>
              <TagsContainer>
                {book.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagsContainer>
            </InfoSection>
          </TopSection>

          {/* 책 소개 섹션 */}
          {book.intro && (
            <Section>
              <SectionTitle>책 소개</SectionTitle>
              <Content isExpanded={expandedSections["intro"]}>{book.intro}</Content>
              <MoreButton onClick={() => setExpandedSections((prev) => ({ ...prev, intro: !prev.intro }))}>
                {expandedSections["intro"] ? "접기" : "더보기"}
              </MoreButton>
            </Section>
          )}

          {/* 목차 섹션 */}
          {book.index && (
            <Section>
              <SectionTitle>목차</SectionTitle>
              <Content isExpanded={expandedSections["index"]}>{book.index}</Content>
              <MoreButton onClick={() => setExpandedSections((prev) => ({ ...prev, index: !prev.index }))}>
                {expandedSections["index"] ? "접기" : "더보기"}
              </MoreButton>
            </Section>
          )}

          {/* 출판사 서평 섹션 */}
          {book.publisherReview && (
            <Section>
              <SectionTitle>출판사 서평</SectionTitle>
              <Content isExpanded={expandedSections["publisherReview"]}>{book.publisherReview}</Content>
              <MoreButton
                onClick={() => setExpandedSections((prev) => ({ ...prev, publisherReview: !prev.publisherReview }))}
              >
                {expandedSections["publisherReview"] ? "접기" : "더보기"}
              </MoreButton>
            </Section>
          )}

          <CommentForm bookId={Number(bookId)} onCommentSubmit={handleCommentSubmit} />

          <ReviewSection>
            <SectionTitle>리뷰</SectionTitle>
            {book.reviews.content.length > 0 ? (
              <>
                {book.reviews.content.map((review) => (
                  <ReviewCard key={review.reviewId} isUserReview={currentUserId === review.reviewerName}>
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
                        bookId={Number(bookId)}
                        reviewId={review.reviewId}
                        initialContent={review.content}
                        isEdit={true}
                        onCommentSubmit={handleCommentSubmit}
                        onCommentDelete={handleReviewDelete}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <>
                        <ReviewContent>
                          <ReviewText>{review.content}</ReviewText>
                          {currentUserId === review.reviewerName && (
                            <ReviewActions>
                              <ActionButton onClick={() => handleEditClick(review.reviewId)}>
                                수정
                              </ActionButton>
                              <ActionButton 
                                className="delete"
                                onClick={() => {
                                  if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
                                    handleReviewDelete(review.reviewId);
                                  }
                                }}
                              >
                                삭제
                              </ActionButton>
                            </ReviewActions>
                          )}
                        </ReviewContent>
                        <LikeButton 
                          className={review.myLiked ? 'liked' : ''}
                          onClick={() => handleLikeToggle(review.reviewId)}
                          disabled={likeLoading[review.reviewId]}
                        >
                          {review.myLiked ? <FaHeart /> : <FaRegHeart />}
                          <span>좋아요 {review.likes}개</span>
                        </LikeButton>
                      </>
                    )}
                  </ReviewCard>
                ))}
                
                {!book.reviews.last && (
                  <LoadMoreButton 
                    onClick={loadMoreReviews}
                    disabled={reviewsLoading}
                  >
                    {reviewsLoading ? '로딩 중...' : '더보기'}
                  </LoadMoreButton>
                )}
                
                <ReviewPagination>
                  <span>총 {book.reviews.totalElements}개의 리뷰 중 {book.reviews.content.length}개 표시 중</span>
                </ReviewPagination>
              </>
            ) : (
              <EmptyReviews>아직 작성된 리뷰가 없습니다.</EmptyReviews>
            )}
          </ReviewSection>

          <PurchaseModal
            isOpen={isPurchaseModalOpen}
            onClose={handlePurchaseModalClose}
            purchaseUrls={purchaseUrls}
            isLoading={storeLoading.purchaseUrls}
            error={storeError.purchaseUrls}
          />
        </>
      )}
    </Container>
  );
};

export default BookDetailPage;
