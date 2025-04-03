import React, { useState } from "react";
import styled from "styled-components";
import api from "../api/axios";
import { useAuthStore } from "../store/useAuthStore"; // 상단에 추가

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

const BookSearchModal: React.FC<BookSearchModalProps> = ({ onClose }) => {
  const { userDetail } = useAuthStore(); // useAuthStore에서 userDetail 가져오기
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<Book[]>([]);

  const searchBooks = async () => {
    try {
      const response = await api.get("/api/search/book", {
        params: {
          title: searchTerm,
          page: 1,
          size: 20,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setBooks(response.data.data.content);
      }
    } catch (error) {
      console.error("도서 검색 실패:", error);
    }
  };

  const handleAddBook = async (bookId: number) => {
    try {
      const requestData = {
        bookId,
        nestId: userDetail?.nestId,
        rating: 0,
        review: "",
      };
      console.log("Request Data:", requestData);

      const response = await api.post("/api/nest", requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // 응답 데이터 확인
      console.log("Response:", response.data);

      if (response.data.success) {
        alert("서재에 책이 추가되었습니다!");
        onClose();
      }
    } catch (error: any) {
      // 에러 상세 정보 확인
      console.error("도서 추가 실패 상세:", {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage = error.response?.data?.message || "도서 추가에 실패했습니다.";
      alert(errorMessage);
    }
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
            <BookCard key={book.bookId} onClick={() => handleAddBook(book.bookId)}>
              <img src={book.imageURL} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.authors}</p>
            </BookCard>
          ))}
        </BookGrid>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BookSearchModal;
