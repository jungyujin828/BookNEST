import React, { useState } from 'react';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';
import api from '../api/axios';

interface BookmarkButtonProps {
  bookId: number;
}

const Button = styled.button<{ isBookmarked: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const HeartIcon = styled(FaHeart)<{ isBookmarked: boolean }>`
  font-size: 24px;
  color: ${props => props.isBookmarked ? '#ff4444' : '#E0E0E0'};
  transition: color 0.2s ease;
`;

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ bookId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = async () => {
    try {
      // Optimistic update
      setIsBookmarked(!isBookmarked);

      const requestData = {
        bookId: bookId.toString()
      };

      let response;
      if (isBookmarked) {
        // 찜 해제
        response = await api.delete('/api/nest/bookmark', {
          data: requestData
        });
      } else {
        // 찜하기
        response = await api.post('/api/nest/bookmark', requestData);
      }

      if (!response.data.success) {
        throw new Error('Failed to toggle bookmark');
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      // 에러 발생 시 상태 되돌리기
      setIsBookmarked(!isBookmarked);
    }
  };

  return (
    <Button 
      isBookmarked={isBookmarked} 
      onClick={handleBookmarkClick}
      aria-label={isBookmarked ? '찜 해제' : '찜하기'}
    >
      <HeartIcon isBookmarked={isBookmarked} />
    </Button>
  );
};

export default BookmarkButton; 