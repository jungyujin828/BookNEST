import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useBookStore } from '../store/useBookStore';

interface Book {
  bookId: number;
  title: string;
  publishedDate: string;
  imageUrl: string;
  authors: string[];
  criticName: string;
  endorsement: string;
  rank: number;
}

interface CriticBooksResponse {
  success: boolean;
  data: Book[];
  error: null | {
    code: string;
    message: string;
    details?: string;
    retryAfter?: number;
  };
}

const CriticBooksContainer = styled.div`
  padding: 16px;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (min-width: 768px) {
    font-size: 22px;
    margin-bottom: 20px;
  }
`;


const CriticName = styled.span`
  color: #00c473;
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

const BookCard = styled(Link)`
  flex: 0 0 140px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
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

const CriticInfo = styled.div`
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
  
  @media (min-width: 768px) {
    padding: 10px 15px;
  }
`;

const Endorsement = styled.p`
  font-size: 11px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const NavigationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 4px;' : 'right: 4px;'}
  transform: translateY(-50%);
  width: 40px;
  height: 60px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.2s ease-in-out;

  @media (min-width: 768px) {
    ${props => props.direction === 'left' ? 'left: -18px;' : 'right: -18px;'}
    width: 60px;
    height: 80px;
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
    width: 16px;
    height: 16px;
    border-top: 3px solid #555;
    border-right: 3px solid #555;
    transform: ${props => props.direction === 'left' ? 'rotate(-135deg) translateX(2px)' : 'rotate(45deg) translateX(-2px)'};
    transition: border-color 0.2s ease;
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

const CriticBooks = () => {
  const { 
    criticBooks, 
    loading, 
    error, 
    setCriticBooks, 
    setLoading, 
    setError 
  } = useBookStore();
  const [scrollPosition, setScrollPosition] = useState(0);
  const bookListRef = useRef<HTMLDivElement>(null);
  const [currentCritic, setCurrentCritic] = useState<string>('');

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
    const fetchCriticBooks = async () => {
      try {
        setLoading('criticBooks', true);
        setError('criticBooks', null);
        
        const response = await api.get<CriticBooksResponse>('/api/book/critic');
        
        if (response.data.success && response.data.data) {
          setCriticBooks(response.data.data);
        } else {
          setError('criticBooks', '평론가 추천 도서 정보를 불러오는데 실패했습니다.');
          setCriticBooks([]);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('criticBooks', '서버 오류가 발생했습니다.');
        setCriticBooks([]);
      } finally {
        setLoading('criticBooks', false);
      }
    };

    fetchCriticBooks();
  }, [setCriticBooks, setLoading, setError]);

  useEffect(() => {
    if (criticBooks && criticBooks.length > 0) {
      setCurrentCritic(criticBooks[0].criticName);
    }
  }, [criticBooks]);

  if (loading.criticBooks) {
    return <LoadingMessage>평론가 추천 도서 목록을 불러오는 중...</LoadingMessage>;
  }

  if (error.criticBooks) {
    return <ErrorMessage>{error.criticBooks}</ErrorMessage>;
  }

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = bookListRef.current 
    ? scrollPosition < bookListRef.current.scrollWidth - bookListRef.current.clientWidth
    : false;

  return (
    <CriticBooksContainer>
      <Title>
        <CriticName>{currentCritic}</CriticName>평론가의 추천 도서
      </Title>
      <BookListContainer>
        {canScrollLeft && (
          <NavigationButton 
            direction="left" 
            onClick={() => handleScroll('left')}
          />
        )}
        <BookList ref={bookListRef}>
          {criticBooks && criticBooks.length > 0 ? (
            criticBooks.map((book) => (
              <BookCard 
                key={book.bookId}
                to={`/book-detail/${book.bookId}`}
              >
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
            <ErrorMessage>평론가 추천 도서 목록이 없습니다.</ErrorMessage>
          )}
        </BookList>
        {canScrollRight && (
          <NavigationButton 
            direction="right" 
            onClick={() => handleScroll('right')}
          />
        )}
      </BookListContainer>
    </CriticBooksContainer>
  );
};

export default CriticBooks; 