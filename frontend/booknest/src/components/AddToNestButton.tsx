import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ROUTES } from "../constants/paths";

interface AddToNestButtonProps {
  bookId: number;
  currentRating: number;
}

const Button = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  justify-content: center;

  svg {
    width: 3rem;
    height: 3rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${(props) => props.color || "#333"};
`;

const ModalButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 8px 16px;
  margin: 8px;
  background-color: ${(props) => (props.variant === "primary" ? "#4a90e2" : "#6c757d")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.variant === "primary" ? "#357abd" : "#5a6268")};
  }
`;

const AddToNestButton: React.FC<AddToNestButtonProps> = ({ bookId, currentRating }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | null>(null);
  const navigate = useNavigate();

  const handleAddToNest = async () => {
    if (currentRating === 0) {
      setModalType("error");
      setShowModal(true);
      return;
    }

    try {
      const requestData = {
        bookId: bookId.toString(),
        nestId: "1",
        rating: currentRating.toString(),
        review: "NULL",
      };

      console.log("Sending request with data:", requestData);
      const response = await api.post("/api/nest", requestData);

      if (response.data.success) {
        setModalType("success");
        setShowModal(true);
      }
    } catch (error: any) {
      console.error("Full error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        requestHeaders: error.config?.headers,
        message: error.message,
      });

      if (error.response?.status === 409) {
        alert("이미 서재에 등록된 도서입니다.");
      } else if (error.response?.status === 400) {
        console.error("Request data that caused 400:", error.config?.data);
        alert("잘못된 요청입니다. 필수 정보를 확인해주세요.");
      } else if (error.response?.status === 403) {
        if (import.meta.env.DEV) {
          console.log("Development environment detected");
          console.log("Request URL:", error.config?.url);
          console.log("Request method:", error.config?.method);
          console.log("Request data:", error.config?.data);
          console.log("Complete request headers:", error.config?.headers);
        }
        alert("권한이 없습니다. 인증 토큰을 확인해주세요.");
      } else {
        alert("서재 등록 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handleGoToNest = () => {
    navigate(ROUTES.NEST);
  };

  return (
    <>
      <Button onClick={handleAddToNest}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3H7C5.9 3 5 3.9 5 5v16l7-3 7 3V5c0-1.1-.9-2-2-2zm-1 11h-3v3h-2v-3H8v-2h3V9h2v3h3v2z" />
        </svg>
      </Button>

      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {modalType === "success" ? (
              <>
                <ModalTitle>서재에 등록되었습니다</ModalTitle>
                <ModalButton variant="primary" onClick={handleGoToNest}>
                  서재 바로가기
                </ModalButton>
                <ModalButton onClick={handleCloseModal}>닫기</ModalButton>
              </>
            ) : (
              <>
                <ModalTitle color="#dc3545">평점 등록은 필수입니다</ModalTitle>
                <ModalButton onClick={handleCloseModal}>확인</ModalButton>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default AddToNestButton;
