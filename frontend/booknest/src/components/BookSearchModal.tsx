import React, { useState } from "react";
import styled from "styled-components";
import api from "../api/axios";
import { useAuthStore } from "../store/useAuthStore";
import RatingStars from "./RatingStars";
import useNestStore from "../store/useNestStore";
import { useNavigate } from "react-router-dom";

interface BookSearchModalProps {
  onClose: () => void;
  onBookAdded?: () => void;
}

interface Book {
  bookId: number;
  title: string;
  imageURL: string;
  authors: string;
}

interface SearchResponse {
  content: Book[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BookCard = styled.div`
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;

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
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.3;
    height: 2.6em;
  }

  p {
    font-size: 12px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-height: 1.3;
    margin-top: auto;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4a90e2' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid ${props => props.active ? '#4a90e2' : '#ddd'};
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background-color: ${props => props.active ? '#357abd' : '#e5e5e5'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TotalResults = styled.div`
  text-align: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
`;

const BookSearchModal: React.FC<BookSearchModalProps> = ({ onClose, onBookAdded }) => {
  const { userDetail } = useAuthStore();
  const { setNestStatus } = useNestStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();
  
  const BOOKS_PER_PAGE = 9;

  const searchBooks = async (page = 1) => {
    try {
      const response = await api.get("/api/search/book", {
        params: {
          title: searchTerm,
          page: page,
          size: BOOKS_PER_PAGE,
        },
      });
      
      if (response.data.success) {
        const searchData: SearchResponse = response.data.data;
        setBooks(searchData.content);
        setTotalPages(searchData.totalPages);
        setTotalElements(searchData.totalElements);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("도서 검색 실패:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      searchBooks(newPage);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchBooks(1);
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
        review: null,
      };
      console.log("Request Data:", requestData);

      const response = await api.post("/api/nest", requestData);

      if (response.data.success) {
        alert("둥지에 책이 추가되었습니다!");
        // 서재 등록 상태 업데이트
        if (selectedBook) {
          setNestStatus(selectedBook.bookId, true);
        }
        setShowRatingModal(false);
        onClose();
        
        // onBookAdded 콜백이 제공된 경우 호출
        if (onBookAdded) {
          onBookAdded();
        } else {
          // 콜백이 제공되지 않은 경우 기존 방식대로 서재 페이지로 이동
          navigate("/nest");
        }
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
        alert("이미 둥지에 등록된 도서입니다.");
      } else if (error.response?.status === 400) {
        console.error("Request data that caused 400:", error.config?.data);
        alert("잘못된 요청입니다. 필수 정보를 확인해주세요.");
      } else if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else if (error.response?.status === 403) {
        alert("권한이 없습니다. 인증 토큰을 확인해주세요.");
      } else {
        const errorMessage = error.response?.data?.message || "둥지 등록 중 오류가 발생했습니다.";
        alert(errorMessage);
      }
    }
  };

  const handleCancelRating = () => {
    setShowRatingModal(false);
    setSelectedBook(null);
    setRating(0);
  };

  // 페이지 버튼 렌더링 함수
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxButtons = 5; // 한 번에 보이는 페이지 버튼 수
    const halfMaxButtons = Math.floor(maxButtons / 2);
    
    let startPage = Math.max(1, currentPage - halfMaxButtons);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    // 이전 페이지 버튼
    pages.push(
      <PageButton 
        key="prev" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </PageButton>
    );
    
    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton 
          key={i} 
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }
    
    // 다음 페이지 버튼
    pages.push(
      <PageButton 
        key="next" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </PageButton>
    );
    
    return pages;
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
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="책 제목을 입력하세요"
        />
        <Button onClick={handleSearch}>검색</Button>
        
        {totalElements > 0 && (
          <TotalResults>총 {totalElements}개의 검색 결과</TotalResults>
        )}
        
        <BookGrid>
          {books.map((book) => (
            <BookCard key={book.bookId} onClick={() => handleBookSelect(book)}>
              <img src={book.imageURL} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.authors}</p>
            </BookCard>
          ))}
        </BookGrid>
        
        {totalPages > 0 && (
          <Pagination>
            {renderPagination()}
          </Pagination>
        )}
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
