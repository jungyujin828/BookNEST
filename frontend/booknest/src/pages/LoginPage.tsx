import { useState } from "react";
import styled from "@emotion/styled";
import { ROUTES, ASSETS, OAUTH } from "../constants/paths";
import config from "../config";
// import InputInfoPage from "./InputInfoPage";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #6dbe64;
  padding: 1.25rem;
  text-align: center;
  position: relative;

  @media (min-width: ${theme.breakpoints.desktop}) {
    flex-direction: row;
    justify-content: space-between;
    padding: 0 5rem;
  }
`;

const LogoSection = styled.div`
  position: absolute;
  top: 25vh;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;

  @media (min-width: ${theme.breakpoints.desktop}) {
    position: static;
    transform: none;
    text-align: left;
    margin-left: 3rem;
  }
`;

const ButtonSection = styled.div`
  position: absolute;
  bottom: 15vh;
  width: 100%;
  max-width: 20rem;
  display: flex;
  flex-direction: column;

  @media (min-width: ${theme.breakpoints.desktop}) {
    position: static;
    margin-right: 3rem;
    align-self: center;
  }
`;

const Logo = styled.div`
  font-size: 5.5rem;
  font-weight: 600;
  line-height: 0.8;
  white-space: pre-line;
  display: flex;
  flex-direction: column;

  & > span:first-of-type {
    text-align: left;
    margin-left: -2.5rem;
  }

  & > span:last-of-type {
    text-align: right;
    margin-right: -2.5rem;
  }

  // 책아이콘 추가해야함
  .book-icon {
    display: none;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0d7323;
  margin-right: -2.5rem;
`;

const EnterButton = styled.button`
  background-color: white;
  color: #69b578;
  border: none;
  padding: 1rem 2rem;
  border-radius: 2rem;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const KakaoButton = styled.button`
  padding: 0.9375rem 1.25rem; // 15px 20px
  border-radius: 0.75rem; // 12px
  gap: 0.5rem; // 8px

  img {
    width: 1.5rem; // 24px
    height: 1.5rem; // 24px
  }
`;

const NaverButton = styled.button`
  padding: 0.9375rem 1.25rem; // 15px 20px
  border-radius: 0.75rem; // 12px
  gap: 0.5rem; // 8px

  img {
    width: 1.5rem; // 24px
    height: 1.5rem; // 24px
  }
`;

const GoogleButton = styled.button`
  padding: 0.9375rem 1.25rem; // 15px 20px
  border-radius: 0.75rem; // 12px
  gap: 0.5rem; // 8px

  img {
    width: 1.5rem; // 24px
    height: 1.5rem; // 24px
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
      scope: "email nickname",
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

  const handleEnterClick = () => {
    const token = localStorage.getItem("token");
    if (token && token !== "test") {
      navigate(ROUTES.HOME);
    } else {
      setShowSocialButtons(true);
    }
  };

  return (
    <LoginContainer>
      <LogoSection>
        <Logo>
          <span>Book</span>
          <span>NEST</span>
        </Logo>
        <Subtitle>
          나의 취향이 가득한
          <br />책 둥지를 틀다
        </Subtitle>
      </LogoSection>

      <ButtonSection>
        {!showSocialButtons ? (
          <EnterButton onClick={handleEnterClick}>입장하기</EnterButton>
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
