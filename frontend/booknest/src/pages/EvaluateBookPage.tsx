import React, { useState } from "react";
import WriteCommentModal from "../components/WriteCommentModal";

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

const books = [
  {
    id: 1,
    title: "모순",
    author: "양귀자",
    image: "/images/mosun.jpg",
  },
  {
    id: 2,
    title: "코스모스",
    author: "칼 세이건",
    image: "/images/cosmos.jpg",
  },
  {
    id: 3,
    title: "침묵의 봄",
    author: "레이첼 카슨",
    image: "/images/silent-spring.jpg",
  },
  {
    id: 4,
    title: "참을 수 없는 존재의 가벼움",
    author: "밀란 쿤데라",
    image: "/images/unbearable.jpg",
  },
];

// Add new state for liked books
const EvaluateBookPage = () => {
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [likedBooks, setLikedBooks] = useState<{ [key: number]: boolean }>({});

  // Add handleLike function
  const handleLike = (bookId: number) => {
    setLikedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const handleRating = (bookId: number, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [bookId]: rating,
    }));
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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {books.map((book) => (
        <div key={book.id} style={{ display: "flex", padding: "15px", borderBottom: "1px solid #eee", gap: "20px" }}>
          <img
            src={book.image}
            alt={book.title}
            style={{
              width: "120px",
              height: "180px",
              objectFit: "cover",
            }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: "0 0 8px 0" }}>{book.title}</h2>
            <p style={{ color: "#666", margin: "0 0 16px 0" }}>{book.author}</p>
            <div style={{ display: "flex", gap: "5px", color: "#ffd700" }}>{renderStars(book.id)}</div>
            <div style={{ display: "flex", gap: "20px", marginTop: "20px", color: "#666", cursor: "pointer" }}>
              <span onClick={() => handleLike(book.id)}>
                <HeartIcon filled={likedBooks[book.id]} />
              </span>
              <span
                onClick={() => {
                  setSelectedBook(book.title);
                  setModalOpen(true);
                }}
              >
                <PencilIcon />
              </span>
              <span
                onClick={() => {
                  /* 관심없음 기능 */
                }}
              >
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
