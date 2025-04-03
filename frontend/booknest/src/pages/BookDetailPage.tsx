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

interface Review {
  reviewId: number;
  reviewerName: string;
  reviewerId: number;
  content: string;
  likes: number;
  createdAt: string;
}

interface BookDetail {
  bookId: number;
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
  reviews: Review[];
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

const BookDetailPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

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
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/book/${bookId}`);

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

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get<{ success: boolean; data: UserInfo; error: null }>("/api/user/info");
        console.log("User info response:", response.data);
        if (response.data.success && response.data.data) {
          console.log("User data:", response.data.data);
          // nickname으로 사용자 식별
          const nickname = response.data.data.nickname;
          console.log("User nickname:", nickname);
          setCurrentUserId(nickname);
          console.log("Current user nickname set to:", nickname);
        } else {
          console.log("No user data in response");
          setCurrentUserId(null);
        }
      } catch (err) {
        // 403 에러는 로그인하지 않은 상태이므로 무시
        if (axios.isAxiosError(err)) {
          console.log("Error status:", err.response?.status);
          console.log("Error data:", err.response?.data);
          if (err.response?.status === 403) {
            setCurrentUserId(null);
            console.log("User not logged in");
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
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/book/${bookId}`);

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

          <ReviewList 
            bookId={Number(bookId)}
            reviews={book.reviews} 
            onReviewChange={handleCommentSubmit}
            currentUserId={currentUserId}
          />

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
