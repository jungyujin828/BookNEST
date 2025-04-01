import React, { useState } from 'react';
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
  gap: 8px;
`;

const StarWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Star = styled(FaStar)<{ filled: boolean; hovered: boolean }>`
  color: ${props => props.filled || props.hovered ? '#FFD700' : '#E0E0E0'};
  font-size: 24px;
  transition: color 0.2s ease;
`;

const CancelButton = styled.button<{ visible: boolean }>`
  display: ${props => props.visible ? 'block' : 'none'};
  padding: 4px 8px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #cc0000;
  }
`;

const RatingStars: React.FC<RatingStarsProps> = ({ bookId, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const { userRatings, setUserRating } = useRatingStore();
  const currentRating = userRatings[bookId] || 0;

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

  const displayRating = hoveredRating !== null ? hoveredRating : currentRating;

  return (
    <StarContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarWrapper
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleStarLeave}
        >
          <Star filled={displayRating >= star} hovered={star <= hoveredRating} />
        </StarWrapper>
      ))}
      <CancelButton 
        visible={currentRating > 0} 
        onClick={handleCancelRating}
      >
        평점 취소
      </CancelButton>
    </StarContainer>
  );
};

export default RatingStars; 