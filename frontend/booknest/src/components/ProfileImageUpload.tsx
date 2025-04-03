import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/axios';

interface ProfileImageUploadProps {
  currentImageUrl: string;
}

const ImageContainer = styled.div`
  position: relative;
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover .overlay {
    opacity: 1;
  }
`;

const ClickableArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  z-index: 2;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ currentImageUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { setUserDetail, userDetail } = useAuthStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    console.log('이미지 클릭됨');
    fileInputRef.current?.click();
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'image');

    try {
      console.log('Cloudinary 업로드 시작...');
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary 응답 에러:', errorData);
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const data = await response.json();
      console.log('Cloudinary 업로드 성공:', data);
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary 업로드 실패:', error);
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  };

  const updateProfileImageInBackend = async (imageUrl: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await api.put(
        '/api/user/profile-image',
        { imgurl: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        throw new Error('프로필 이미지 업데이트에 실패했습니다.');
      }

      return response.data;
    } catch (error) {
      console.error('백엔드 업데이트 실패:', error);
      throw error;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    try {
      setIsUploading(true);

      // Cloudinary에 이미지 업로드
      const imageUrl = await uploadToCloudinary(file);
      console.log('받은 이미지 URL:', imageUrl);

      // 백엔드 API 호출
      await updateProfileImageInBackend(imageUrl);

      // Zustand store 업데이트
      if (userDetail) {
        const updatedUserDetail = {
          ...userDetail,
          profileURL: imageUrl
        };
        
        // Zustand store 업데이트
        setUserDetail(updatedUserDetail);
        
        // 로컬 스토리지에 업데이트된 사용자 정보 저장
        localStorage.setItem('userDetail', JSON.stringify(updatedUserDetail));
      }
      
      alert('프로필 이미지가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert('프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <ImageContainer onClick={handleClick}>
        <ProfileImage src={currentImageUrl} alt="프로필 이미지" />
        <Overlay className="overlay">
          사진 변경
        </Overlay>
      </ImageContainer>
      {isUploading && (
        <LoadingOverlay>
          업로드 중...
        </LoadingOverlay>
      )}
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileImageUpload; 