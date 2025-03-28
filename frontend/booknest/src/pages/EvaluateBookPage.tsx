import React, { useState, useEffect } from "react"; // useEffect 추가
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import WriteCommentModal from "../components/WriteCommentModal";
import api from "../api/axios";

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

const StarIcon = ({ filled = false, half = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    {half && <path d="M12 2l0 15.77 -6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />}
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
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [likedBooks, setLikedBooks] = useState<{ [key: number]: boolean }>({});
  const [books, setBooks] = useState<Book[]>([]); // 책 목록 상태 추가

  // 베스트셀러 목록을 불러오는 useEffect 추가
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await api.get("/api/book/best"); // 실제 API 엔드포인트로 수정 필요
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

  // 기존 별점 데이터를 가져오는 함수 추가
  const fetchUserRatings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/book/{bookId}/rating", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        const userRatings = response.data.data.ratedBooks.reduce((acc: any, book: any) => {
          acc[book.bookId] = book.rating;
          return acc;
        }, {});
        setRatings(userRatings);
      }
    } catch (error) {
      console.error("기존 별점 데이터를 불러오는데 실패했습니다:", error);
    }
  };

  // useEffect에 fetchUserRatings 추가
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserRatings();
    };
    fetchData();
  }, []);

  const handleRating = async (bookId: number, rating: number) => {
    try {
      // 로컬 상태 업데이트
      setRatings((prev) => ({
        ...prev,
        [bookId]: rating,
      }));

      // API 호출
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/api/book/${bookId}/rating`,
        {
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("별점 등록 실패:", error);
      // 에러 발생 시 로컬 상태 롤백
      setRatings((prev) => ({
        ...prev,
        [bookId]: prev[bookId] || 0,
      }));
    }
  };

  const renderStars = (bookId: number) => {
    const rating = ratings[bookId] || 0;
    const stars = [];
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      const isHalf = rating === i - 0.5;
      const isFilled = rating >= i;

      stars.push(
        <span key={i} style={{ position: "relative", cursor: "pointer" }}>
          <StarIcon filled={isFilled} half={isHalf} />
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "50%",
              height: "100%",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRating(bookId, i - 0.5);
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              width: "50%",
              height: "100%",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRating(bookId, i);
            }}
          />
        </span>
      );
    }
    return stars;
  };

  // return문 내부, 최상단 div 안에 버튼 추가
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <button
        onClick={() => navigate("/search")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      >
        도서 검색하기
      </button>
      <button
        onClick={() => navigate("/home")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#808080",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "10px",
          fontSize: "16px",
        }}
      >
        건너뛰기
      </button>
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
            <div style={{ display: "flex", gap: "5px", color: "#ffd700" }}>{renderStars(book.bookId)}</div>
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
    </div>
  );
};

export default EvaluateBookPage;
