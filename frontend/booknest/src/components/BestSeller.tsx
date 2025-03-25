import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import api from '../api/axios';
import { useBookStore } from '../store/useBookStore';

interface Book {
  bookId: number;
  title: string;
  publishedDate: string;
  imageUrl: string;
  authors: string[];
}

interface BestSellerResponse {
  success: boolean;
  data: Book[];
  error: null | string;
}

const BestSellerContainer = styled.div`
  padding: 16px;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
  
  @media (min-width: 768px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const BookListContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  margin: 0 -16px;
  padding: 0 16px;
  
  @media (min-width: 768px) {
    margin: 0;
    padding: 0;
  }
`;

const BookList = styled.div`
  display: flex;
  gap: 12px;
  transition: transform 0.3s ease;
  padding: 10px 0;
  
  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const BookCard = styled.div`
  flex: 0 0 140px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    flex: 0 0 200px;
  }
`;

const BookImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f5f5f5;
  
  @media (min-width: 768px) {
    height: 280px;
  }
`;

const BookInfo = styled.div`
  padding: 12px;
  
  @media (min-width: 768px) {
    padding: 15px;
  }
`;

const BookTitle = styled.h3`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

const BookAuthor = styled.p`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    font-size: 14px;
    margin-bottom: 5px;
  }
`;

const BookDate = styled.p`
  font-size: 11px;
  color: #999;
  
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const NavigationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 4px;' : 'right: 4px;'}
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.2s ease-in-out;

  @media (min-width: 768px) {
    ${props => props.direction === 'left' ? 'left: -18px;' : 'right: -18px;'}
    width: 44px;
    height: 44px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0;
    cursor: default;
    pointer-events: none;
  }

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-top: 2.5px solid #555;
    border-right: 2.5px solid #555;
    transform: ${props => props.direction === 'left' ? 'rotate(-135deg) translateX(2px)' : 'rotate(45deg) translateX(-2px)'};
    transition: border-color 0.2s ease;
    
    @media (min-width: 768px) {
      width: 12px;
      height: 12px;
      border-top: 3px solid #555;
      border-right: 3px solid #555;
    }
  }

  &:hover::before {
    border-color: #333;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  padding: 16px;
  text-align: center;
  background-color: #fff3f3;
  border-radius: 8px;
  margin: 16px 0;
  font-size: 14px;
  
  @media (min-width: 768px) {
    padding: 20px;
    margin: 20px 0;
    font-size: 16px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 32px;
  color: #666;
  font-size: 14px;
  
  @media (min-width: 768px) {
    padding: 40px;
    font-size: 16px;
  }
`;

const BestSeller = () => {
  const { 
    bestSellers, 
    loading, 
    error, 
    setBestSellers, 
    setLoading, 
    setError 
  } = useBookStore();
  const [scrollPosition, setScrollPosition] = useState(0);
  const bookListRef = useRef<HTMLDivElement>(null);

  const SCROLL_AMOUNT = window.innerWidth < 768 ? 300 : 400;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!bookListRef.current) return;

    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - SCROLL_AMOUNT)
      : Math.min(
          bookListRef.current.scrollWidth - bookListRef.current.clientWidth,
          scrollPosition + SCROLL_AMOUNT
        );

    setScrollPosition(newPosition);
    bookListRef.current.style.transform = `translateX(-${newPosition}px)`;
  };

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading('bestSellers', true);
        setError('bestSellers', null);
        
        const response = await api.get('/api/book/best');
        
        if (response.data.success && response.data.data) {
          setBestSellers(response.data.data);
        } else {
          setError('bestSellers', '베스트셀러 정보를 불러오는데 실패했습니다.');
          setBestSellers([]);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('bestSellers', '서버 오류가 발생했습니다.');
        setBestSellers([]);
      } finally {
        setLoading('bestSellers', false);
      }
    };

    fetchBestSellers();
  }, [setBestSellers, setLoading, setError]);

  if (loading.bestSellers) {
    return <LoadingMessage>베스트셀러 목록을 불러오는 중...</LoadingMessage>;
  }

  if (error.bestSellers) {
    return <ErrorMessage>{error.bestSellers}</ErrorMessage>;
  }

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = bookListRef.current 
    ? scrollPosition < bookListRef.current.scrollWidth - bookListRef.current.clientWidth
    : false;

  return (
    <BestSellerContainer>
      <Title>월간 베스트셀러</Title>
      <BookListContainer>
        {canScrollLeft && (
          <NavigationButton 
            direction="left" 
            onClick={() => handleScroll('left')}
          />
        )}
        <BookList ref={bookListRef}>
          {bestSellers && bestSellers.length > 0 ? (
            bestSellers.map((book) => (
              <BookCard key={book.bookId}>
                <BookImage 
                  src={book.imageUrl || '/images/default-book.png'} 
                  alt={book.title}
                />
                <BookInfo>
                  <BookTitle>{book.title}</BookTitle>
                  <BookAuthor>{book.authors.join(', ')}</BookAuthor>
                  <BookDate>{book.publishedDate}</BookDate>
                </BookInfo>
              </BookCard>
            ))
          ) : (
            <ErrorMessage>베스트셀러 목록이 없습니다.</ErrorMessage>
          )}
        </BookList>
        {canScrollRight && (
          <NavigationButton 
            direction="right" 
            onClick={() => handleScroll('right')}
          />
        )}
      </BookListContainer>
    </BestSellerContainer>
  );
};

export default BestSeller;
