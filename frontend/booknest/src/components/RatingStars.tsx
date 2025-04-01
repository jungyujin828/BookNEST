import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import api from '../api/axios';
import useRatingStore from '../store/useRatingStore';

interface RatingStarsProps {
  bookId: number;
  onRatingChange: (rating: number) => void;
}

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StarButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${props => props.$active ? '#f8c41b' : '#ddd'};
  font-size: 24px;
  transition: color 0.2s ease;

  &:hover {
    color: #f8c41b;
  }
`;

const RatingStars: React.FC<RatingStarsProps> = ({ bookId, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const { userRatings, setUserRating } = useRatingStore();
  const currentRating = userRatings[bookId] || 0;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await api.get(`/api/book/${bookId}/rating`);
        if (response.data.success && response.data.data) {
          const { rating } = response.data.data;
          setUserRating(bookId, rating);
          onRatingChange(rating);
        }
      } catch (error) {
        console.error('Failed to fetch rating:', error);
        // 404 에러는 평점이 없는 경우이므로 무시
        if (error.response?.status !== 404) {
          console.error('Error fetching rating:', error);
        }
      }
    };

    fetchRating();
  }, [bookId, setUserRating, onRatingChange]);

  const handleStarClick = async (score: number) => {
    try {
      // Optimistic update
      setUserRating(bookId, score);
      onRatingChange(score);

      console.log('Submitting rating:', {
        bookId,
        score,
        currentRating,
        method: currentRating > 0 ? 'PUT' : 'POST'
      });

      // If there's an existing rating, use PUT, otherwise use POST
      const method = currentRating > 0 ? 'put' : 'post';
      const response = await api[method](`/api/book/${bookId}/rating`, {
        score: score
      });

      console.log('Rating response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.error?.message || `Failed to ${method} rating`);
      }
    } catch (error) {
      console.error(`Failed to ${currentRating > 0 ? 'update' : 'create'} rating:`, error);
      // Revert optimistic update on error
      setUserRating(bookId, currentRating);
      onRatingChange(currentRating);
    }
  };

  const handleCancelRating = async () => {
    try {
      // Optimistic update
      setUserRating(bookId, 0);
      onRatingChange(0);

      const response = await api.delete(`/api/book/${bookId}/rating`);
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to delete rating');
      }
    } catch (error) {
      console.error('Failed to delete rating:', error);
      // Revert optimistic update on error
      setUserRating(bookId, currentRating);
      onRatingChange(currentRating);
    }
  };

  const handleStarHover = (score: number) => {
    setHoveredRating(score);
  };

  const handleStarLeave = () => {
    setHoveredRating(null);
  };

  return (
    <StarContainer>
      {[1, 2, 3, 4, 5].map((score) => (
        <StarButton
          key={score}
          $active={score <= (hoveredRating || currentRating)}
          onClick={() => handleStarClick(score)}
          onMouseEnter={() => handleStarHover(score)}
          onMouseLeave={handleStarLeave}
        >
          <FaStar />
        </StarButton>
      ))}
      {currentRating > 0 && (
        <button
          onClick={handleCancelRating}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            marginLeft: '8px',
            fontSize: '14px'
          }}
        >
          취소
        </button>
      )}
    </StarContainer>
  );
};

export default RatingStars; 