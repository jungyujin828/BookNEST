import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ROUTES, API_PATHS } from '../constants/paths';
import config from '../config';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        // URL에서 인가 코드 추출
        const code = new URL(window.location.href).searchParams.get('code');
        
        if (!code) {
          throw new Error('Authorization code not found');
        }

        // 백엔드로 인가 코드 전송
        const response = await axios.post(
          `${config.api.baseUrl}${API_PATHS.GOOGLE_LOGIN}`, 
          { code }
        );
        
        // 응답 처리
        if (response.data.isNewUser) {
          // 새로운 사용자인 경우 회원정보 입력 페이지로 이동
          localStorage.setItem('token', response.data.token);
          navigate('/input-info');
        } else {
          // 기존 사용자인 경우 토큰 저장 후 메인 페이지로 이동
          localStorage.setItem('token', response.data.token);
          navigate(ROUTES.HOME);
        }
      } catch (error) {
        console.error('구글 로그인 처리 중 오류 발생:', error);
        navigate(ROUTES.LOGIN);
      }
    };

    handleGoogleLogin();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>구글 로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallback; 