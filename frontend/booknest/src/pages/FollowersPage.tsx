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
}

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
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

  return (
    <Container>
      <h1>팔로워 목록</h1>
      {followers.map((follower) => (
        <UserCard key={follower.userId} onClick={() => navigate(`/profile/${follower.userId}`)}>
          <ProfileImage src={follower.profileURL} alt={follower.nickname} />
          <UserInfo>
            <h3>{follower.nickname}</h3>
            <p>{follower.archeType}</p>
            <p>평가 {follower.totalRatings}개</p>
          </UserInfo>
        </UserCard>
      ))}
    </Container>
  );
};

export default FollowersPage;
