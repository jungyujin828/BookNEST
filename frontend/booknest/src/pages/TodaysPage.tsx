import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../api/axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/paths";

interface Book {
  bookId: number;
  imageUrl: string;
  publishedDate: string;
  indexContent: string;
  publisherReview: string;
  title: string;
  isbn: string;
  publisher: string;
  pages: number;
  intro: string;
  authors: string;
  categories: string;
  tags: string;
}
const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const SlideContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlideCard = styled.div`
  width: 100%;
  height: 100%;
  justify-content: flex-end;
`;

const SlideImageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 70vh;
  object-fit: cover;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 30%, rgba(0, 0, 0, 1) 100%);
    pointer-events: none;
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: 70vh;
  object-fit: cover;
`;

const SlideInfo = styled.div`
  position: absolute;
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  justify-content: flex-end;
  padding: 1rem;
`;

const BookTitle = styled.h2`
  font-size: 30px;
  color: white;
`;
const AuthorButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const BookAuthor = styled.p`
  font-size: 16px;
  color: #cccccc;
`;

const BookDescription = styled.p`
  font-size: 0.9rem;
  color: white;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #fff;
`;

const NavigationButton = styled.button<{ direction: "left" | "right" }>`
  position: absolute;
  ${(props) => props.direction}: 20px;
  top: 35%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const BasicInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailButton = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #fff;
`;

const EvaluateButton = styled.button`
  position: absolute;
  bottom: 10rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 32px;
  backdrop-filter: blur(8px);
  transition: background-color 0.2s;
`;

const DetailInfo = styled.div<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  margin-top: 20px;
`;

// TodaysPage 컴포넌트 내부에 상태 추가
const TodaysPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/api/book/today");
        if (response.data.success) {
          setBooks(response.data.data);
        }
      } catch (error) {
        console.error("추천 도서 목록을 불러오는데 실패했습니다:", error);
      }
    };

    fetchBooks();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : books.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < books.length - 1 ? prev + 1 : 0));
  };

  if (!books.length) return <div>로딩중...</div>;

  const currentBook = books[currentIndex];

  // 컴포넌트 return 부분 수정
  return (
    <MainContainer>
      <SlideContainer>
        <SlideCard>
          <SlideImageContainer>
            <SlideImage src={currentBook.imageUrl} alt={currentBook.title} />
          </SlideImageContainer>
          <SlideInfo onClick={() => navigate(`/book-detail/${currentBook.bookId}`)}>
            <BasicInfo>
              <DetailInfo isVisible={showDetail}>
                <BookDescription>
                  {currentBook.intro || currentBook.publisherReview || "도서 설명이 없습니다."}
                </BookDescription>
              </DetailInfo>
              <TagContainer>
                {currentBook.tags?.split(",").map((tag, index) => <Tag key={index}>{tag.trim()}</Tag>) || []}
              </TagContainer>
              <BookTitle>{currentBook.title}</BookTitle>
              <AuthorButtonWrapper>
                <BookAuthor>{currentBook.authors}</BookAuthor>
                <DetailButton onClick={() => setShowDetail(!showDetail)}>
                  {showDetail ? "간단히 보기" : "상세 보기"}
                </DetailButton>
              </AuthorButtonWrapper>
            </BasicInfo>
          </SlideInfo>
        </SlideCard>
        <NavigationButton direction="left" onClick={handlePrevious}>
          <FaChevronLeft />
        </NavigationButton>
        <NavigationButton direction="right" onClick={handleNext}>
          <FaChevronRight />
        </NavigationButton>
      </SlideContainer>
      <EvaluateButton onClick={() => navigate(ROUTES.EVALUATE_BOOK)}>도서 평가하기</EvaluateButton>
    </MainContainer>
  );
};

export default TodaysPage;
