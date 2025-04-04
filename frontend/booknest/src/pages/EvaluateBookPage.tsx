import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import WriteCommentModal from "../components/WriteCommentModal";
import api from "../api/axios";
import { theme } from "../styles/theme";
import RatingStars from "../components/RatingStars";

// Modify HeartIcon component to accept filled prop
const HeartIcon = ({ filled = false }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "#ff69b4" : "none"}
    stroke={filled ? "#ff69b4" : "currentColor"}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const PencilIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const BanIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const NextButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 0.3rem;
  background-color: #000;
  color: black;
  border: none;
  cursor: pointer;
  background-color: transparent;
  zoom: 2;

  @media (min-width: ${theme.breakpoints.desktop}) {
    bottom: 0.5rem;
  }
`;

const NextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M14 6l6 6-6 6" />
  </svg>
);

// Book 타입 정의 추가
interface Book {
  bookId: number;
  title: string;
  publishedDate: string;
  imageUrl: string;
  authors: string[];
}

const EvaluateBookPage = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [likedBooks, setLikedBooks] = useState<{ [key: number]: boolean }>({});
  const [books, setBooks] = useState<Book[]>([]);

  // 베스트셀러 목록을 불러오는 useEffect
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await api.get("/api/book/best");
        if (response.data.success) {
          setBooks(response.data.data);
        }
      } catch (error) {
        console.error("베스트셀러 목록을 불러오는데 실패했습니다:", error);
      }
    };

    fetchBestSellers();
  }, []);

  // Add handleLike function
  const handleLike = (bookId: number) => {
    setLikedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const handleRatingChange = (bookId: number, rating: number) => {
    console.log(`Book ${bookId} rated: ${rating}`);
  };

  return (
    <>
      <NextButton onClick={() => navigate("/home")}>
        <NextIcon />
      </NextButton>
      {books.map((book) => (
        <div
          key={book.bookId}
          style={{ display: "flex", padding: "15px", borderBottom: "1px solid #eee", gap: "20px" }}
        >
          <img
            src={book.imageUrl}
            alt={book.title}
            style={{
              width: "120px",
              height: "180px",
              objectFit: "cover",
            }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: "0 0 8px 0" }}>{book.title}</h2>
            <p style={{ color: "#666", margin: "0 0 16px 0" }}>{book.authors.join(", ")}</p>
            <div style={{ display: "flex", gap: "5px", color: "#ffd700" }}>
              <RatingStars 
                bookId={book.bookId} 
                onRatingChange={(rating) => handleRatingChange(book.bookId, rating)} 
              />
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "20px", color: "#666", cursor: "pointer" }}>
              <span onClick={() => handleLike(book.bookId)}>
                <HeartIcon filled={likedBooks[book.bookId]} />
              </span>
              <span
                onClick={() => {
                  setSelectedBook(book.title);
                  setModalOpen(true);
                }}
              >
                <PencilIcon />
              </span>
              <span onClick={() => {}}>
                <BanIcon />
              </span>
            </div>
          </div>
        </div>
      ))}

      <WriteCommentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} bookTitle={selectedBook} />
    </>
  );
};

export default EvaluateBookPage;
