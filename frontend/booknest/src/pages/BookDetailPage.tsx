import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { theme } from "../styles/theme";

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
import DeleteToNestButton from "../components/DeleteToNestButton";
import ReviewList, { Review, ReviewsPage } from "../components/ReviewList";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useNestStore from "../store/useNestStore";

interface BookDetail {
  bookId: number;
  isBookMarked: boolean;
  isInNest: boolean;
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
  nestId?: number;
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
  nestId: number;
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
  white-space: pre-line;
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
  border: 1px solid ${(props) => (props.isUserReview ? "#4CAF50" : "#dee2e6")};
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: ${(props) => (props.isUserReview ? "#f8fff8" : "#fff")};
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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [contentHeights, setContentHeights] = useState<{
    [key: string]: boolean;
  }>({});
  const introRef = useRef<HTMLParagraphElement>(null);
  const indexRef = useRef<HTMLParagraphElement>(null);
  const publisherReviewRef = useRef<HTMLParagraphElement>(null);
  const reviewListRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); // Add this import at the top

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
  const { setNestStatus, getNestStatus } = useNestStore();

  useEffect(() => {
    // URL에 fromReviews 파라미터가 있으면 리뷰 섹션으로 스크롤
    if (location.search.includes("fromReviews") && reviewListRef.current) {
      const headerHeight = 70; // 4rem = 64px (1rem = 16px)
      const yOffset = -headerHeight;
      const element = reviewListRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [location, book]);

  useEffect(() => {
    const checkContentHeight = (element: HTMLElement | null, key: string) => {
      if (!element) return;
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const height = element.scrollHeight;
      const lines = height / lineHeight;
      setContentHeights((prev) => ({ ...prev, [key]: lines > 3 }));
    };
    // book 데이터가 있을 때만 높이 체크
    if (book) {
      checkContentHeight(introRef.current, "intro");
      checkContentHeight(indexRef.current, "index");
      checkContentHeight(publisherReviewRef.current, "publisherReview");
    }
  }, [book]); // book 데이터가 변경될 때만 실행

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: UserInfo;
          error: null;
        }>("/api/user/info");
        if (response.data.success && response.data.data) {
          setUserInfo(response.data.data);
        }
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!bookId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/book/${bookId}`);

        if (response.data.success) {
          const bookData = response.data.data;
          setBook(bookData);

          // 서재 등록 상태를 store에 저장 (API 응답 값이 있을 때만)
          if (typeof bookData.isInNest === "boolean") {
            setNestStatus(Number(bookId), bookData.isInNest);
          }
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

    fetchBookDetail();
  }, [bookId, setNestStatus]);

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
      const response = await api.get(`/api/book/${bookId}?page=1&size=5`);

      if (response.data.success) {
        setBook(response.data.data);
      }
    } catch (err) {
      console.error("Book API Error:", err);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    try {
      // 책 정보를 다시 불러와서 평균 평점 업데이트
      const response = await api.get(`/api/book/${bookId}`);

      if (response.data.success) {
        setBook(response.data.data);
      } else {
        throw new Error("Failed to fetch updated book data");
      }
    } catch (err) {
      console.error("Error updating rating:", err);
      setError("평점 업데이트에 실패했습니다.");
    }
  };

  const handleNestUpdate = () => {
    if (book) {
      const newStatus = !getNestStatus(book.bookId);
      setNestStatus(book.bookId, newStatus);

      // 서재에 등록되면 북마크는 자동으로 해제됨
      if (newStatus) {
        setBook((prev) => (prev ? { ...prev, isBookMarked: false } : null));
      }

      // 상태 변경 후 책 정보 다시 불러오기
      const fetchUpdatedBookDetail = async () => {
        try {
          const response = await api.get(`/api/book/${bookId}`);
          if (response.data.success) {
            setBook(response.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch updated book details:", err);
        }
      };

      fetchUpdatedBookDetail();
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
            <BookmarkButton bookId={book.bookId} isBookMarked={book.isBookMarked} />
          </BookHeader>
          <TopSection>
            <ImageSection>
              <BookImage src={book.imageUrl} alt={book.title} />
              <ButtonContainer>
                {getNestStatus(book.bookId) ? (
                  <DeleteToNestButton bookId={book.bookId} nestId={userInfo?.nestId || 0} onDelete={handleNestUpdate} />
                ) : (
                  <AddToNestButton
                    bookId={book.bookId}
                    currentRating={userRatings[book.bookId] || 0}
                    onAdd={handleNestUpdate}
                  />
                )}
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
              <Content ref={introRef} isExpanded={expandedSections["intro"]}>
                {book.intro}
              </Content>
              {contentHeights["intro"] && (
                <MoreButton
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      intro: !prev.intro,
                    }))
                  }
                >
                  {expandedSections["intro"] ? "접기" : "더보기"}
                </MoreButton>
              )}
            </Section>
          )}

          {/* 목차 섹션 */}
          {book.index && (
            <Section>
              <SectionTitle>목차</SectionTitle>
              <Content ref={indexRef} isExpanded={expandedSections["index"]}>
                {book.index}
              </Content>
              {contentHeights["index"] && (
                <MoreButton
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      index: !prev.index,
                    }))
                  }
                >
                  {expandedSections["index"] ? "접기" : "더보기"}
                </MoreButton>
              )}
            </Section>
          )}

          {/* 출판사 서평 섹션 */}
          {book.publisherReview && (
            <Section>
              <SectionTitle>출판사 서평</SectionTitle>
              <Content ref={publisherReviewRef} isExpanded={expandedSections["publisherReview"]}>
                {book.publisherReview}
              </Content>
              {contentHeights["publisherReview"] && (
                <MoreButton
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      publisherReview: !prev.publisherReview,
                    }))
                  }
                >
                  {expandedSections["publisherReview"] ? "접기" : "더보기"}
                </MoreButton>
              )}
            </Section>
          )}

          <CommentForm bookId={Number(bookId)} onCommentSubmit={handleCommentSubmit} />
          <div ref={reviewListRef}>
            <ReviewList
              bookId={Number(bookId)}
              reviews={book.reviews}
              onReviewChange={handleCommentSubmit}
              currentUserId={userInfo?.nickname || null}
            />
          </div>

          {/* 중복된 ReviewList 컴포넌트 제거 */}

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
