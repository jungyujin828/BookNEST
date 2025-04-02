import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Follower {
  userId: number;
  nickname: string;
  profileURL: string;
  archeType: string;
  totalRatings: number;
  isFollowing: boolean; // 추가
}

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const FollowButton = styled.button<{ isFollowing: boolean }>`
  background-color: ${(props) => (props.isFollowing ? "#FFE5EC" : "#7bc47f")};
  color: ${(props) => (props.isFollowing ? "#FF2E63" : "white")};
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${(props) => (props.isFollowing ? "#FFD1DC" : "#69b578")};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  gap: 15px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const FollowersPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [followers, setFollowers] = useState<Follower[]>([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await api.get("/api/follow/follower", {
          params: {
            targetUserId: userId,
            size: 100,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setFollowers(response.data.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch followers:", error);
      }
    };

    fetchFollowers();
  }, [userId]);

  const handleFollow = async (targetUserId: number) => {
    try {
      const response = await api.post(
        "/api/follow",
        { targetUserId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // Optionally refresh the followers list or show success message
        console.log("Successfully followed user");
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  return (
    <Container>
      <h1>팔로워 목록</h1>
      {followers.map((follower) => (
        <UserCard key={follower.userId}>
          <div
            onClick={() => navigate(`/profile/${follower.userId}`)}
            style={{ cursor: "pointer", display: "flex", flex: 1, gap: "15px" }}
          >
            <ProfileImage src={follower.profileURL} alt={follower.nickname} />
            <UserInfo>
              <h3>{follower.nickname}</h3>
              <p>{follower.archeType}</p>
              <p>평가 {follower.totalRatings}개</p>
            </UserInfo>
          </div>
          <FollowButton isFollowing={follower.isFollowing} onClick={() => handleFollow(follower.userId)}>
            {follower.isFollowing ? "팔로우" : "팔로우"}
          </FollowButton>
        </UserCard>
      ))}
    </Container>
  );
};

export default FollowersPage;
