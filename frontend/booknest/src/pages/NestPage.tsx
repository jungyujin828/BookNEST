import React from "react";

const NestPage = () => {
  return (
    <div className="nest-container">
      <h1>내 책장</h1>
      <div className="nest-content">
        <section className="book-list-section">
          <h2>내가 읽은 책들</h2>
          {/* 책 목록이 들어갈 자리 */}
        </section>

        <section className="reading-status">
          <h2>독서 현황</h2>
          {/* 독서 통계나 현황이 들어갈 자리 */}
        </section>
      </div>
    </div>
  );
};

export default NestPage;
