import styled from "@emotion/styled";
import { ROUTES } from "../constants/paths";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import LogoutModal from "../components/LogoutModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import EditInfoModal from "../components/EditInfoModal";
import ProfileImageUpload from "../components/ProfileImageUpload";

// Import theme for breakpoints
import { theme } from "../styles/theme";
import UserSearchModal from "../components/UserSearchModal";

const BlankBox = styled.div`
  background-color: #fafafa;
  min-height: 100vh;
`;

const ProfileContainer = styled.div`
  background-color: #ffffff;
  padding: 1rem;

  @media (min-width: ${theme.breakpoints.desktop}) {
    border-left: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
    width: 640px;
    margin: 0 auto;
  }
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
  position: relative;
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
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem 0;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    position: relative;
    width: 100%;

    &:hover {
      background-color: #f5f5f5;
      border-radius: 0.3rem;
    }

    strong {
      font-size: 32px;
      font-weight: 700;
      color: #000;
      margin-bottom: 8px;
    }

    div {
      font-size: 14px;
      color: #666;
      padding: 0;
    }
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

const SettingsDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const FollowButton = styled.button<{ isFollowing: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  background-color: ${(props) => (props.isFollowing ? "#f1f1f1" : "#7bc47f")};
  color: ${(props) => (props.isFollowing ? "#666" : "white")};
  cursor: pointer;
  width: 8rem;
  margin-top: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isFollowing ? "#e1e1e1" : "#6ab36e")};
  }
`;

const ProfilePage = () => {
  const { userDetail, setUserDetail } = useAuthStore();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const savedUserDetail = localStorage.getItem("userDetail");
    if (savedUserDetail) {
      const parsedUserDetail = JSON.parse(savedUserDetail);
      setUserDetail(parsedUserDetail);
    }
  }, [setUserDetail]);

  // 페이지 진입 시 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      try {
        const response = await api.get("/api/user/info", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setUserDetail(response.data.data);
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };

    fetchCurrentUserInfo();
  }, [setUserDetail]);

  // 기존 코드 유지...
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
          // Update following status from profile data
          setIsFollowing(response.data.data.isFollowing);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, userDetail?.userId, navigate]);

  // Remove the separate checkFollowStatus useEffect

  // profileData를 사용하도록 JSX 수정
  const displayData = profileData || userDetail;

  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 컴포넌트 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showEditModal]);

  // 팔로우/언팔로우 처리 함수 추가
  const handleFollowToggle = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      if (isFollowing) {
        // 언팔로우 요청
        const response = await api.delete(`/api/follow?targetUserId=${userId}`, {
          headers,
        });
        if (response.data.success) {
          setIsFollowing(false);
        }
      } else {
        // 팔로우 요청
        const response = await api.post(`/api/follow?targetUserId=${userId}`, {}, { headers });
        if (response.data.success) {
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error("팔로우/언팔로우 작업 실패:", error);
    }
  };

  return (
    <BlankBox>
      <ProfileContainer>
        <UserProfile>
          <UserInfo>
            <UserBasicInfo>
              {isOwnProfile ? (
                <ProfileImageUpload currentImageUrl={userDetail?.profileURL || "/default-profile.jpg"} />
              ) : (
                <ProfileImage>
                  <img src={displayData?.profileURL || "/default-profile.jpg"} alt="profile" />
                </ProfileImage>
              )}
              <UserNameSection>
                <IconContainer>
                  <IconButton
                    style={{ display: isOwnProfile ? "block" : "none" }}
                    onClick={() => setShowUserSearchModal(true)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                  </IconButton>
                  <IconButton
                    style={{ display: isOwnProfile ? "block" : "none" }}
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.12-.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                    </svg>
                  </IconButton>
                  {showSettings && (
                    <SettingsDropdown>
                      <DropdownItem onClick={() => setShowLogoutModal(true)}>로그아웃</DropdownItem>
                      <DropdownItem onClick={() => setShowDeleteModal(true)}>회원탈퇴</DropdownItem>
                    </SettingsDropdown>
                  )}
                </IconContainer>
                {/* Add UserSearchModal */}
                {showUserSearchModal && <UserSearchModal onClose={() => setShowUserSearchModal(false)} />}
                {/* Other modals */}
                {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} />}
                {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
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
                {isOwnProfile ? (
                  <EditButton onClick={() => setShowEditModal(true)}>프로필 수정</EditButton>
                ) : (
                  <FollowButton isFollowing={isFollowing} onClick={handleFollowToggle}>
                    {isFollowing ? "팔로잉" : "팔로우"}
                  </FollowButton>
                )}
              </UserNameSection>
            </UserBasicInfo>
          </UserInfo>
        </UserProfile>

        {showEditModal && (
          <EditInfoModal
            onClose={() => setShowEditModal(false)}
            userInfo={{
              nickname: displayData?.nickname || "",
              gender: displayData?.gender || "설정안함",
              birthdate: displayData?.birthdate || "",
            }}
          />
        )}

        <hr />

        <UserStats>
          <div onClick={() => navigate(`${ROUTES.MY_EVALUATED_BOOKS}/${userId}`)}>
            <strong>{displayData?.totalRatings || 0}</strong>
            <div>평가</div>
          </div>
          <div onClick={() => navigate(`${ROUTES.MY_COMMENTS}/${userId}`)}>
            <strong>{displayData?.totalReviews || 0}</strong>
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
    </BlankBox>
  );
};

export default ProfilePage;
