import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ROUTES, API_PATHS } from '../constants/paths';
import { useAuthStore } from '../store/useAuthStore';

const NaverCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleNaverLogin = async () => {
      try {
        // URL에서 인가 코드와 state 추출
        const code = new URL(window.location.href).searchParams.get('code');
        const state = new URL(window.location.href).searchParams.get('state');
        
        if (!code || !state) {
          throw new Error('Authorization code or state not found');
        }

        // 백엔드로 인가 코드 전송
        const response = await api.post(API_PATHS.NAVER_LOGIN, { code, state });
        
        if (response.data.success) {
          const { accessToken, user } = response.data.data;
          
          if (user.isNew) {
            // 새로운 사용자인 경우 회원정보 입력 페이지로 이동
            localStorage.setItem('token', accessToken);
            navigate(ROUTES.INPUT_INFO);
          } else {
            // 기존 사용자인 경우 토큰 저장 후 메인 페이지로 이동
            login(accessToken, user);
            navigate(ROUTES.HOME);
          }
        } else {
          throw new Error(response.data.error?.message || '로그인에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('네이버 로그인 처리 중 오류 발생:', error);
        navigate(ROUTES.LOGIN);
      }
    };

    handleNaverLogin();
  }, [navigate, login]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>네이버 로그인 처리 중...</p>
    </div>
  );
};

export default NaverCallback; 