import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ROUTES, API_PATHS } from '../constants/paths';
import config from '../config';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        // URL에서 인가 코드 추출
        const code = new URLSearchParams(window.location.search).get('code');
        
        if (!code) {
          throw new Error('Authorization code not found');
        }

        // 백엔드로 인가 코드 전송
        const response = await axios.post(
          `${config.api.baseUrl}${API_PATHS.KAKAO_LOGIN}`, 
          { code }
        );
        
        // 응답 처리
        if (response.data.data.user.isNew) {
          // 새로운 사용자인 경우 회원정보 입력 페이지로 이동
          localStorage.setItem('token', response.data.data.accessToken);
          navigate('/input-info');
        } else {
          // 기존 사용자인 경우 토큰 저장 후 메인 페이지로 이동
          localStorage.setItem('token', response.data.data.accessToken);
          navigate(ROUTES.HOME);
        }
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류 발생:', error);
        navigate(ROUTES.LOGIN);
      }
    };

    handleKakaoLogin();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>카카오 로그인 처리 중...</p>
    </div>
  );
};

export default KakaoCallback; 