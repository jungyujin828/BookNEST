import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaHeart } from "react-icons/fa";
import api from "../api/axios";

interface BookmarkButtonProps {
  bookId: number;
}

interface BookmarkItem {
  bookId: number;
  title: string;
  authors: string[];
  imageUrl: string;
  createdAt: string;
}

const Button = styled.button<{ $isBookmarked: boolean }>`
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

const HeartIcon = styled(FaHeart)<{ $isBookmarked: boolean }>`
  font-size: 24px;
  color: ${(props) => (props.$isBookmarked ? "#ff4444" : "#E0E0E0")};
  transition: color 0.2s ease;
`;

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ bookId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // 북마크 목록 조회 함수
  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/nest/bookmark");
      
      if (response.data.success) {
        const bookmarks: BookmarkItem[] = response.data.data;
        // 현재 도서가 북마크 되어있는지 확인
        const isCurrentBookMarked = bookmarks.some(bookmark => bookmark.bookId === bookId);
        setIsBookmarked(isCurrentBookMarked);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
      // 로그인하지 않은 경우 등은 에러로 간주하지 않고 북마크 해제 상태로 표시
      setIsBookmarked(false);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 북마크 상태 조회
  useEffect(() => {
    fetchBookmarks();
  }, [bookId]);

  const handleBookmarkClick = async () => {
    try {
      // Optimistic update
      setIsBookmarked(!isBookmarked);

      const requestData = {
        bookId: bookId.toString(),
      };

      let response;
      if (isBookmarked) {
        // 찜 해제
        response = await api.delete("/api/nest/bookmark", {
          data: requestData,
        });
      } else {
        // 찜하기
        response = await api.post("/api/nest/bookmark", requestData);
      }

      if (!response.data.success) {
        throw new Error("Failed to toggle bookmark");
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      // 에러 발생 시 상태 되돌리기
      setIsBookmarked(!isBookmarked);
    }
  };

  return (
    <Button 
      $isBookmarked={isBookmarked} 
      onClick={handleBookmarkClick} 
      aria-label={isBookmarked ? "찜 해제" : "찜하기"}
      disabled={loading}
    >
      <HeartIcon $isBookmarked={isBookmarked} />
    </Button>
  );
};

export default BookmarkButton;
