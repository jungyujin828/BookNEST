import React, { useState } from "react";
import styled from "styled-components";
import api from "../api/axios";
import { useAuthStore } from "../store/useAuthStore";
import RatingStars from "./RatingStars";

interface BookSearchModalProps {
  onClose: () => void;
}

interface Book {
  bookId: number;
  title: string;
  imageURL: string;
  authors: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
`;

const BookCard = styled.div`
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;

  &:hover {
    background-color: #f5f5f5;
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 14px;
    margin: 5px 0;
  }

  p {
    font-size: 12px;
    color: #666;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const RatingModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const RatingContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const RatingTitle = styled.h3`
  margin-bottom: 20px;
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
`;

const ConfirmButton = styled(Button)`
  background-color: #4a90e2;
  color: white;
  border: none;

  &:hover {
    background-color: #357abd;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const BookSearchModal: React.FC<BookSearchModalProps> = ({ onClose }) => {
  const { userDetail } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const searchBooks = async () => {
    try {
      const response = await api.get("/api/search/book", {
        params: {
          title: searchTerm,
          page: 1,
          size: 20,
        },
      });
      if (response.data.success) {
        setBooks(response.data.data.content);
      }
    } catch (error) {
      console.error("도서 검색 실패:", error);
    }
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setShowRatingModal(true);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleConfirmRating = async () => {
    if (rating === 0) {
      alert("평점을 선택해주세요.");
      return;
    }

    if (!selectedBook) return;

    try {
      // 평점은 이미 RatingStars 컴포넌트에서 등록되었으므로 바로 둥지에 추가
      if (!userDetail?.nestId) {
        alert("사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.");
        return;
      }

      const requestData = {
        bookId: selectedBook.bookId.toString(),
        nestId: userDetail.nestId.toString(),
        rating: Math.round(rating).toString(),
        review: "NULL",
      };
      console.log("Request Data:", requestData);

      const response = await api.post("/api/nest", requestData);

      if (response.data.success) {
        alert("서재에 책이 추가되었습니다!");
        setShowRatingModal(false);
        onClose();
      }
    } catch (error: any) {
      console.error("Full error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        requestHeaders: error.config?.headers,
        message: error.message,
      });

      if (error.response?.status === 409) {
        alert("이미 서재에 등록된 도서입니다.");
      } else if (error.response?.status === 400) {
        console.error("Request data that caused 400:", error.config?.data);
        alert("잘못된 요청입니다. 필수 정보를 확인해주세요.");
      } else if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else if (error.response?.status === 403) {
        alert("권한이 없습니다. 인증 토큰을 확인해주세요.");
      } else {
        const errorMessage = error.response?.data?.message || "서재 등록 중 오류가 발생했습니다.";
        alert(errorMessage);
      }
    }
  };

  const handleCancelRating = () => {
    setShowRatingModal(false);
    setSelectedBook(null);
    setRating(0);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>도서 검색</h2>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchBooks()}
          placeholder="책 제목을 입력하세요"
        />
        <BookGrid>
          {books.map((book) => (
            <BookCard key={book.bookId} onClick={() => handleBookSelect(book)}>
              <img src={book.imageURL} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.authors}</p>
            </BookCard>
          ))}
        </BookGrid>
      </ModalContent>

      {showRatingModal && selectedBook && (
        <RatingModal onClick={(e) => e.stopPropagation()}>
          <RatingContent>
            <RatingTitle>{selectedBook.title} 평점 등록</RatingTitle>
            <p>이 책에 대한 평점을 등록해주세요.</p>
            <RatingContainer>
              <RatingStars 
                bookId={selectedBook.bookId} 
                onRatingChange={handleRatingChange} 
              />
            </RatingContainer>
            <ButtonGroup>
              <ConfirmButton onClick={handleConfirmRating}>확인</ConfirmButton>
              <CancelButton onClick={handleCancelRating}>취소</CancelButton>
            </ButtonGroup>
          </RatingContent>
        </RatingModal>
      )}
    </ModalOverlay>
  );
};

export default BookSearchModal;
