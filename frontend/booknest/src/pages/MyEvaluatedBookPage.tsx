import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import api from '../api/axios';

interface RatedBook {
  bookId: number;
  ratingId: number;
  bookName: string;
  imageUrl: string;
  rating: number;
  authors: string[];
}

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
`;

const BookList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BookCard = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BookCover = styled.img`
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
`;

const BookInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BookTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const Authors = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled(FaStar)<{ filled: boolean }>`
  color: ${props => props.filled ? '#FFD700' : '#E0E0E0'};
  font-size: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  font-size: 18px;

  &:hover {
    color: #333;
  }
`;

const MyEvaluatedBookPage = () => {
  const [books, setBooks] = useState<RatedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatedBooks = async () => {
      try {
        const response = await api.get('/api/book/rating');
        if (response.data.success) {
          setBooks(response.data.data);
        } else {
          setError('평가한 책 목록을 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch rated books:', error);
        setError('평가한 책 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRatedBooks();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.floor(rating)} />
    ));
  };

  if (loading) {
    return <Container>로딩 중...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  return (
    <Container>
      <PageTitle>내가 평가한 책</PageTitle>
      <BookList>
        {books.map((book) => (
          <BookCard key={book.ratingId}>
            <BookCover src={book.imageUrl} alt={book.bookName} />
            <BookInfo>
              <div>
                <BookTitle>{book.bookName}</BookTitle>
                <Authors>{book.authors.join(', ')}</Authors>
              </div>
              <StarRating>
                {renderStars(book.rating)}
              </StarRating>
            </BookInfo>
          </BookCard>
        ))}
      </BookList>
    </Container>
  );
};

export default MyEvaluatedBookPage; 