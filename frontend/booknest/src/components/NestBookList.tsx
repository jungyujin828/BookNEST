import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

interface Book {
  bookId: number;
  title: string;
  authors: string;
  imageUrl: string;
  createdAt: string;
  userRating: number;
  userReview: string;
}

interface NestResponse {
  content: Book[];
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  first: boolean;
  last: boolean;
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
  gap: 16px;
`;

const BookCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  gap: 20px;

  &:hover {
    transform: translateY(-2px);
  }
`;

const BookImage = styled.img`
  width: 100px;
  height: 145px;
  object-fit: cover;
  border-radius: 8px;
`;

const BookInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BookTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const BookAuthor = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;

const Rating = styled.div`
  color: #f8c41b;
  font-size: 16px;
  margin-bottom: 8px;
`;

const Review = styled.p`
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  margin: 0;
  font-style: italic;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  text-align: center;
  padding: 20px;
  background-color: #f8d7da;
  border-radius: 8px;
  margin: 20px 0;
`;

const NestBookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userDetail } = useAuthStore();

  useEffect(() => {
    const fetchBooks = async () => {
      if (!userDetail) {
        setError('사용자 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        console.log('User Detail:', userDetail);
        console.log('Current Token:', localStorage.getItem('token'));
        console.log('API Default Headers:', api.defaults.headers);
        
        console.log('Request URL:', `${api.defaults.baseURL}/api/nest`);
        
        const response = await api.get('/api/nest');

        console.log('Response Config:', response.config);
        console.log('Response Headers:', response.headers);
        console.log('Response Data:', response.data);

        if (response.data.success) {
          if (response.data.data.content) {
            setBooks(response.data.data.content);
          } else {
            setBooks([]);
          }
        } else {
          setError(response.data.error?.message || '서재 목록을 불러오는데 실패했습니다.');
        }
      } catch (error: any) {
        console.error('Error fetching nest books:', error);
        if (error.response?.status === 401) {
          setError('로그인이 필요한 서비스입니다.');
        } else if (error.response?.status === 403) {
          setError('이 요청을 수행할 권한이 없습니다.');
        } else if (error.response?.status === 404) {
          setError('둥지에서 등록된 책 목록 데이터를 찾을 수 없습니다.');
        } else if (error.response?.status === 429) {
          setError('요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.');
        } else if (error.response?.status === 500) {
          setError('서버 내부 오류가 발생했습니다.');
        } else {
          setError('서재 목록을 불러오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userDetail]);

  if (loading) return <Container>로딩 중...</Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;
  if (books.length === 0) return <Container>등록된 책이 없습니다.</Container>;

  return (
    <Container>
      <PageTitle>내 서재</PageTitle>
      <BookList>
        {books.map((book) => (
          <BookCard key={book.bookId}>
            <BookImage src={book.imageUrl} alt={book.title} />
            <BookInfo>
              <BookTitle>{book.title}</BookTitle>
              <BookAuthor>{book.authors}</BookAuthor>
              <Rating>★ {book.userRating.toFixed(1)}</Rating>
              {book.userReview && <Review>"{book.userReview}"</Review>}
            </BookInfo>
          </BookCard>
        ))}
      </BookList>
    </Container>
  );
};

export default NestBookList;
