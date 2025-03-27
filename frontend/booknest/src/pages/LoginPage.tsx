import { useState } from "react";
import styled from "@emotion/styled";
import { ASSETS, OAUTH } from "../constants/paths";
import config from "../config";
// import InputInfoPage from "./InputInfoPage";
import { useNavigate } from "react-router-dom";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  background-color: #69b578;
  padding: 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const LogoSection = styled.div`
  margin-top: 60px;
  color: white;
  text-align: center;
  
  @media (min-width: 768px) {
    margin-top: 80px;
  }
  
  @media (min-width: 1024px) {
    margin-top: 100px;
  }
`;

const Logo = styled.div`
  font-size: 36px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 16px;

  .book-icon {
    display: inline-block;
    margin-left: 10px;
  }
  
  @media (min-width: 768px) {
    font-size: 48px;
    margin-bottom: 20px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin-top: 16px;
  color: white;
  
  @media (min-width: 768px) {
    font-size: 18px;
    margin-top: 20px;
  }
`;

const ButtonSection = styled.div`
  width: 100%;
  max-width: 320px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (min-width: 768px) {
    max-width: 400px;
    margin-bottom: 40px;
    gap: 12px;
  }
`;

const EnterButton = styled.button`
  background-color: white;
  color: #69b578;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-bottom: 16px;

  &:hover {
    background-color: #f0f0f0;
  }
  
  @media (min-width: 768px) {
    padding: 15px 30px;
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const KakaoButton = styled.button`
  background-color: #fee500;
  color: #000000;
  border: none;
  padding: 15px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #fdd835;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const NaverButton = styled.button`
  background-color: #03c75a;
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #02b150;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const GoogleButton = styled.button`
  background-color: white;
  color: #000000;
  border: 1px solid #ddd;
  padding: 15px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #f5f5f5;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const LoginPage = () => {
  const [showSocialButtons, setShowSocialButtons] = useState(false);
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    const params = new URLSearchParams({
      client_id: config.kakao.clientId,
      redirect_uri: config.kakao.redirectUri,
      response_type: "code",
    });
    const kakaoURL = `${OAUTH.KAKAO.AUTH_URL}?${params.toString()}`;
    window.location.href = kakaoURL;
  };

  const handleNaverLogin = () => {
    const state = Math.random().toString(36).substr(2, 11);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: config.naver.clientId,
      redirect_uri: config.naver.redirectUri,
      state: state,
    });

    const naverURL = `${OAUTH.NAVER.AUTH_URL}?${params.toString()}`;
    window.location.href = naverURL;
  };

  const handleGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: config.google.clientId,
      redirect_uri: config.google.redirectUri,
      response_type: "code",
      scope: OAUTH.GOOGLE.SCOPE,
      access_type: "offline",
      prompt: "consent",
    });

    const googleURL = `${OAUTH.GOOGLE.AUTH_URL}?${params.toString()}`;
    window.location.href = googleURL;
  };

  const goToInputInfoPage = () => {
    navigate("/input-info");
  };

  return (
    <LoginContainer>
      <LogoSection>
        <Logo>
          Book
          <br />
          NEST
          <span className="book-icon">📖</span>
        </Logo>
        <Subtitle>
          나의 취향이 가득한
          <br />책 둥지를 틀다
        </Subtitle>
      </LogoSection>

      {/* 개발용 버튼은 스타일링 추가 또는 제거 고려 */}
      <button 
        onClick={goToInputInfoPage}
        style={{ 
          padding: '8px 16px', 
          borderRadius: '8px',
          border: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          marginBottom: '20px'
        }}
      >
        정보 입력 페이지로 이동
      </button>

      <ButtonSection>
        {!showSocialButtons ? (
          <EnterButton onClick={() => setShowSocialButtons(true)}>입장하기</EnterButton>
        ) : (
          <>
            <KakaoButton onClick={handleKakaoLogin}>
              <img src={ASSETS.ICONS.KAKAO} alt="카카오 로고" />
              카카오 로그인
            </KakaoButton>
            <NaverButton onClick={handleNaverLogin}>
              <img src={ASSETS.ICONS.NAVER} alt="네이버 로고" />
              네이버 로그인
            </NaverButton>
            <GoogleButton onClick={handleGoogleLogin}>
              <img src={ASSETS.ICONS.GOOGLE} alt="구글 로고" />
              Google로 계속하기
            </GoogleButton>
          </>
        )}
      </ButtonSection>
    </LoginContainer>
  );
};

export default LoginPage;
