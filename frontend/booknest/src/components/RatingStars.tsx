import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import api from '../api/axios';

interface RatingStarsProps {
  bookId: number;
  initialRating?: number;
  onRatingChange?: (newRating: number) => void;
}

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StarWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Star = styled.span<{ filled: boolean }>`
  position: absolute;
  font-size: 24px;
  color: ${props => props.filled ? '#ffd700' : '#e0e0e0'};
  transition: color 0.2s ease;
  
  &:hover {
    color: #ffd700;
  }
`;

const RatingStars: React.FC<RatingStarsProps> = ({ bookId, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await api.get(`/api/book/${bookId}/rating`);
        if (response.data.success) {
          setRating(response.data.data.score);
        }
      } catch (error) {
        console.error('Failed to fetch user rating:', error);
      }
    };

    fetchUserRating();
  }, [bookId]);

  const handleStarClick = async (score: number) => {
    if (isSubmitting) return;
    
    // 즉시 UI 업데이트
    setRating(score);
    
    try {
      setIsSubmitting(true);
      const response = await api.post(`/api/book/${bookId}/rating`, {
        score
      });

      if (response.data.success) {
        onRatingChange?.(score);
      }
    } catch (error) {
      // 에러 발생 시 이전 평점으로 되돌림
      setRating(rating);
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (score: number) => {
    setHoveredRating(score);
  };

  const handleStarLeave = () => {
    setHoveredRating(null);
  };

  const displayRating = hoveredRating !== null ? hoveredRating : rating;

  return (
    <StarContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarWrapper
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleStarLeave}
        >
          <Star filled={displayRating >= star}>★</Star>
        </StarWrapper>
      ))}
    </StarContainer>
  );
};

export default RatingStars; 