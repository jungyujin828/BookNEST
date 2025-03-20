import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        // URL에서 인가 코드 추출
        const code = new URL(window.location.href).searchParams.get('code');
        
        if (!code) {
          throw new Error('Authorization code not found');
        }

        // 백엔드로 인가 코드 전송
        const response = await axios.post('/api/auth/kakao/callback', { code });
        
        // 응답 처리
        if (response.data.isNewUser) {
          // 새로운 사용자인 경우 회원가입 페이지로 이동
          navigate('/signup', { 
            state: { 
              kakaoData: response.data.userData,
              token: response.data.token 
            } 
          });
        } else {
          // 기존 사용자인 경우 토큰 저장 후 메인 페이지로 이동
          localStorage.setItem('token', response.data.token);
          navigate('/');
        }
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류 발생:', error);
        navigate('/login');
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