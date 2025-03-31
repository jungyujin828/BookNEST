import styled from "@emotion/styled";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ProfileContainer = styled.div`
  padding: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const UserProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const UserBasicInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

const UserNameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-grow: 1;
`;

const UserLevel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  width: 8rem;
  &:hover {
    background: #f5f5f5;
  }
`;

const UserName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const ProfileImage = styled.div`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserStats = styled.div`
  width: 100%;
  justify-content: space-around;
  display: flex;
  gap: 40px;
  position: relative;
  align-items: center;
  min-height: 5rem;

  div {
    text-align: center;
  }

  div:first-of-type::after {
    content: "";
    position: absolute;
    right: 50%;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-color: #ddd;
  }

  strong {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 4px;
  }
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
`;

const ArchetypeCard = styled.div`
  background: #fff9e6;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const DonutChart = styled.div`
  // 도넛 차트 스타일링
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.span<{ color?: string }>`
  padding: 5px 10px;
  border-radius: 15px;
  background-color: ${(props) => props.color || "#e0e0e0"};
  color: ${(props) => (props.color ? "white" : "black")};
`;

const BestReview = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AuthorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AuthorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

const ProfilePage = () => {
  const { userDetail } = useAuthStore();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);

  // 현재 프로필이 로그인한 사용자의 것인지 확인
  const isOwnProfile = userDetail?.userId === Number(userId);

  useEffect(() => {
    // URL에 userId가 없으면 현재 로그인된 사용자의 프로필로 리다이렉트
    if (!userId && userDetail?.userId) {
      navigate(`/profile/${userDetail.userId}`);
      return;
    }

    // userId가 있으면 해당 유저의 프로필 정보를 가져옴
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/user/mypage", {
          params: {
            targetUserId: userId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, userDetail?.userId, navigate]);

  // profileData를 사용하도록 JSX 수정
  const displayData = profileData || userDetail;

  return (
    <ProfileContainer>
      <UserProfile>
        <UserInfo>
          <UserBasicInfo>
            <ProfileImage>
              <img src={displayData?.profileURL} alt="profile" />
            </ProfileImage>
            <UserNameSection>
              <IconContainer>
                <IconButton>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </IconButton>
                <IconButton>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13-.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                  </svg>
                </IconButton>
              </IconContainer>
              <UserName>{displayData?.nickname || "사용자"}</UserName>
              <UserLevel>
                <span onClick={() => navigate(`/profile/${userId}/followers`)} style={{ cursor: "pointer" }}>
                  팔로워 <strong>{displayData?.followers || 0}</strong>
                </span>
                {" | "}
                <span onClick={() => navigate(`/profile/${userId}/followings`)} style={{ cursor: "pointer" }}>
                  팔로잉 <strong>{displayData?.followings || 0}</strong>
                </span>
              </UserLevel>
              <EditButton style={{ display: isOwnProfile ? "block" : "none" }}>프로필 수정</EditButton>
            </UserNameSection>
          </UserBasicInfo>
        </UserInfo>
      </UserProfile>

      <hr />

      <UserStats>
        <div>
          <strong>{userDetail?.totalRatings || 0}</strong>
          <div>평가</div>
        </div>
        <div>
          <strong>{userDetail?.totalReviews || 0}</strong>
          <div>코멘트</div>
        </div>
      </UserStats>

      <hr />

      <Section>
        <SectionTitle>아키타입</SectionTitle>
        <ArchetypeCard>
          <h4>명랑한 아이기꾼 앵무새</h4>
          <p>"약간의 어리석음은 괜찮아. 우리는 모두 조금씩 이상하니까."</p>
          <DonutChart>{/* 도넛 차트 구현 필요 */}</DonutChart>
        </ArchetypeCard>
      </Section>

      <hr />

      <Section>
        <SectionTitle>선호태그</SectionTitle>
        <TagCloud>
          <Tag color="#ff69b4">서양</Tag>
          <Tag color="#4169e1">디스토피아</Tag>
          <Tag color="#32cd32">고등학생</Tag>
          <Tag color="#ffa500">영화</Tag>
          <Tag color="#8a2be2">인문학</Tag>
          <Tag color="#ff4500">영화화</Tag>
          <Tag color="#2e8b57">로맨스</Tag>
        </TagCloud>
      </Section>

      <hr />

      <Section>
        <SectionTitle>BEST 한줄평</SectionTitle>
        <BestReview>
          <p>"우리는 행복하지만, 이 행복이 근심을 모르는 것"</p>
          <div>❤️ 203</div>
        </BestReview>
      </Section>

      <hr />
      <Section>
        <SectionTitle>선호하는 작가</SectionTitle>
        <AuthorList>
          <AuthorItem>
            <img src="/author1.jpg" alt="김초엽" />
            <div>김초엽</div>
          </AuthorItem>
          <AuthorItem>
            <img src="/author2.jpg" alt="J.K 롤링" />
            <div>J.K 롤링</div>
          </AuthorItem>
          <AuthorItem>
            <img src="/author3.jpg" alt="칼 세이건" />
            <div>칼 세이건</div>
          </AuthorItem>
        </AuthorList>
      </Section>
    </ProfileContainer>
  );
};

export default ProfilePage;
