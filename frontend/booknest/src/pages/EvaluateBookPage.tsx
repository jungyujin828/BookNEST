import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import api from "../api/axios";
import { theme } from "../styles/theme";
import RatingStars from "../components/RatingStars";
import BookmarkButton from "../components/BookmarkButton";
import IgnoreButton from "../components/IgnoreButton";

const NextButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 0.3rem;
  background-color: transparent;
  color: black;
  border: none;
  cursor: pointer;
  zoom: 2;

  @media (min-width: ${theme.breakpoints.desktop}) {
    bottom: 0.5rem;
  }
`;

const NextIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14M14 6l6 6-6 6" />
  </svg>
);

interface Book {
  bookId: number;
  title: string;
  publishedDate: string;
  imageUrl: string;
  authors: string[];
}

interface PaginatedResponse {
  content: Book[];
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  first: boolean;
  last: boolean;
}

const SortButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const SortButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: ${(props) => (props.isActive ? "#4CAF50" : "#f0f0f0")};
  color: ${(props) => (props.isActive ? "white" : "black")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#45a049" : "#e0e0e0")};
  }
`;

const EvaluateBookPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"RANDOM" | "POPULAR" | "RECENT">(
    "RANDOM"
  );

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/api/search/eval", {
          params: {
            keyword: sortBy,
            page: page,
            size: 10,
          },
        });

        if (!response.data.success) {
          throw new Error("책 목록을 불러오는데 실패했습니다.");
        }

        const paginatedData = response.data.data as PaginatedResponse;
        setBooks(paginatedData.content);
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다:", error);
        setError("데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, sortBy]);

  const handleRatingChange = (bookId: number, rating: number) => {
    console.log(`Book ${bookId} rated: ${rating}`);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>로딩 중...</div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        {error}
        <button
          onClick={() => window.location.reload()}
          style={{
            display: "block",
            margin: "20px auto",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      <SortButtonGroup>
        <SortButton
          isActive={sortBy === "RANDOM"}
          onClick={() => setSortBy("RANDOM")}
        >
          랜덤
        </SortButton>
        <SortButton
          isActive={sortBy === "POPULAR"}
          onClick={() => setSortBy("POPULAR")}
        >
          인기순
        </SortButton>
        <SortButton
          isActive={sortBy === "RECENT"}
          onClick={() => setSortBy("RECENT")}
        >
          최신순
        </SortButton>
      </SortButtonGroup>
      <NextButton onClick={() => navigate("/home")}>
        <NextIcon />
      </NextButton>
      {books.map((book) => (
        <div
          key={book.bookId}
          style={{
            display: "flex",
            padding: "15px",
            borderBottom: "1px solid #eee",
            gap: "20px",
          }}
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
            <p style={{ color: "#666", margin: "0 0 16px 0" }}>
              {book.authors.join(", ")}
            </p>
            <div style={{ display: "flex", gap: "5px", color: "#ffd700" }}>
              <RatingStars
                bookId={book.bookId}
                onRatingChange={(rating) =>
                  handleRatingChange(book.bookId, rating)
                }
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "20px",
                color: "#666",
              }}
            >
              <BookmarkButton bookId={book.bookId} />
              <IgnoreButton bookId={book.bookId} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default EvaluateBookPage;
