import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import api from '../api/axios';
import PurchaseModal from '../components/PurchaseModal';
import LibraryModal from '../components/LibraryModal';
import { useBookStore } from '../store/useBookStore';

interface Review {
  reviewId: number;
  reviewerName: string;
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

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 20px;
`;

const Star = styled.span`
  color: #ffd700;
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

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
`;

const Content = styled.p`
  line-height: 1.6;
  color: #495057;
  white-space: pre-line;
`;

const ReviewSection = styled.div`
  margin-top: 40px;
`;

const ReviewCard = styled.div`
  padding: 16px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ReviewerName = styled.span`
  font-weight: bold;
  color: #495057;
`;

const ReviewDate = styled.span`
  color: #868e96;
  font-size: 14px;
`;

const ReviewContent = styled.p`
  margin-bottom: 8px;
  color: #495057;
`;

const LikeCount = styled.div`
  color: #868e96;
  font-size: 14px;
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
  gap: 12px;
  margin-top: 16px;
`;

const PurchaseButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background-color: #4CAF50;
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

const LibraryButton = styled(PurchaseButton)`
  background-color: #2196F3;

  &:hover {
    background-color: #1976D2;
  }

  &:active {
    background-color: #1565C0;
  }
`;

const BookDetailPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Zustand store
  const {
    purchaseUrls,
    libraryBooks,
    loading: storeLoading,
    error: storeError,
    setPurchaseUrls,
    setLibraryBooks,
    setLoading: setStoreLoading,
    setError: setStoreError
  } = useBookStore();

  // 모달 상태
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/book/${bookId}`);
        
        if (response.data.success) {
          setBook(response.data.data);
        } else {
          setError('도서 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('서버 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetail();
    }
  }, [bookId]);

  const handlePurchaseClick = async () => {
    try {
      setStoreLoading('purchaseUrls', true);
      setStoreError('purchaseUrls', null);
      setIsPurchaseModalOpen(true);

      const response = await api.get(`/api/book/${bookId}/purchase`);
      
      if (response.data.success) {
        setPurchaseUrls(response.data.data);
      } else {
        setStoreError('purchaseUrls', '구매 링크를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Purchase API Error:', err);
      setStoreError('purchaseUrls', '서버 오류가 발생했습니다.');
    } finally {
      setStoreLoading('purchaseUrls', false);
    }
  };

  const handleLibraryClick = async () => {
    try {
      setStoreLoading('libraryBooks', true);
      setStoreError('libraryBooks', null);
      setIsLibraryModalOpen(true);

      const response = await api.get(`/api/book/${bookId}/ebook`);
      
      if (response.data.success) {
        setLibraryBooks(response.data.data.libraryBooks);
      } else {
        setStoreError('libraryBooks', '전자도서관 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Library API Error:', err);
      setStoreError('libraryBooks', '서버 오류가 발생했습니다.');
    } finally {
      setStoreLoading('libraryBooks', false);
    }
  };

  const handlePurchaseModalClose = () => {
    setIsPurchaseModalOpen(false);
    setPurchaseUrls(null);
  };

  const handleLibraryModalClose = () => {
    setIsLibraryModalOpen(false);
    setLibraryBooks(null);
  };

  if (loading) {
    return <LoadingMessage>도서 정보를 불러오는 중...</LoadingMessage>;
  }

  if (error || !book) {
    return <ErrorMessage>{error || '도서 정보를 찾을 수 없습니다.'}</ErrorMessage>;
  }

  return (
    <Container>
      <TopSection>
        <ImageSection>
          <BookImage src={book.imageUrl} alt={book.title} />
          <ButtonContainer>
            <PurchaseButton onClick={handlePurchaseClick}>
              구매하기
            </PurchaseButton>
            <LibraryButton onClick={handleLibraryClick}>
              전자도서관
            </LibraryButton>
          </ButtonContainer>
        </ImageSection>
        <InfoSection>
          <Title>{book.title}</Title>
          <Rating>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index}>
                {index < Math.floor(book.avgRating) ? '★' : '☆'}
              </Star>
            ))}
            <span>{book.avgRating.toFixed(1)}</span>
          </Rating>
          <AuthorInfo>
            저자: {book.authors.join(', ')}
          </AuthorInfo>
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

      <Section>
        <SectionTitle>책 소개</SectionTitle>
        <Content>{book.intro}</Content>
      </Section>

      <Section>
        <SectionTitle>목차</SectionTitle>
        <Content>{book.index}</Content>
      </Section>

      <Section>
        <SectionTitle>출판사 서평</SectionTitle>
        <Content>{book.publisherReview}</Content>
      </Section>

      <ReviewSection>
        <SectionTitle>리뷰</SectionTitle>
        {book.reviews.map((review) => (
          <ReviewCard key={review.reviewId}>
            <ReviewHeader>
              <ReviewerName>{review.reviewerName}</ReviewerName>
              <ReviewDate>
                {new Date(review.createdAt).toLocaleDateString()}
              </ReviewDate>
            </ReviewHeader>
            <ReviewContent>{review.content}</ReviewContent>
            <LikeCount>좋아요 {review.likes}개</LikeCount>
          </ReviewCard>
        ))}
      </ReviewSection>

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={handlePurchaseModalClose}
        purchaseUrls={purchaseUrls}
        isLoading={storeLoading.purchaseUrls}
        error={storeError.purchaseUrls}
      />

      <LibraryModal
        isOpen={isLibraryModalOpen}
        onClose={handleLibraryModalClose}
        libraryBooks={libraryBooks}
        isLoading={storeLoading.libraryBooks}
        error={storeError.libraryBooks}
      />
    </Container>
  );
};

export default BookDetailPage;
