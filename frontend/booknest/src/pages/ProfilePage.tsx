import React from "react";

const ProfilePage = () => {
  // 상태 관리나 기타 로직을 여기에 작성

  return (
    <div className="profile-container">
      <h1>프로필</h1>

      <div className="profile-content">
        <section className="user-info">
          <h2>사용자 정보</h2>
          <div className="profile-image">
            {/* 프로필 이미지가 들어갈 자리 */}
          </div>
          <div className="user-details">
            {/* 사용자 상세 정보가 들어갈 자리 */}
          </div>
        </section>

        <section className="user-preferences">
          <h2>설정</h2>
          {/* 사용자 설정이 들어갈 자리 */}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
