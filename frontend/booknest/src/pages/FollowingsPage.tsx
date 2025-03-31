import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import api from "../api/axios";
import { useNavigate } from "react-router-dom"; // 추가

interface Following {
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
  cursor: pointer; // 추가
  &:hover {
    // 추가
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

const FollowingPage = () => {
  const navigate = useNavigate(); // 추가
  const { userId } = useParams();
  const [followings, setFollowings] = useState<Following[]>([]);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const response = await api.get("/api/follow/following", {
          params: {
            targetUserId: userId,
            size: 100,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setFollowings(response.data.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch followings:", error);
      }
    };

    fetchFollowings();
  }, [userId]);

  return (
    <Container>
      <h1>팔로잉 목록</h1>
      {followings.map((following) => (
        <UserCard
          key={following.userId}
          onClick={() => navigate(`/profile/${following.userId}`)} // 추가
        >
          <ProfileImage src={following.profileURL} alt={following.nickname} />
          <UserInfo>
            <h3>{following.nickname}</h3>
            <p>{following.archeType}</p>
            <p>평가 {following.totalRatings}개</p>
          </UserInfo>
        </UserCard>
      ))}
    </Container>
  );
};

export default FollowingPage;
