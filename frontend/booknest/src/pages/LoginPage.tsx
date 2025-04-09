import { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { ROUTES, OAUTH } from "../constants/paths";
import config from "../config";
// import InputInfoPage from "./InputInfoPage";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { FiRefreshCw } from "react-icons/fi";

import KakaoIcon from "../icons/kakao.png";
import NaverIcon from "../icons/naver.png";
import GoogleIcon from "../icons/google.png";

// Add this interface near the top of the file, after imports
interface LoginContainerProps {
  isChanging: boolean;
}

const LoginContainer = styled.div<LoginContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: "black";
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("bg.png") no-repeat center center;
  background-size: cover;
  text-align: center;
  position: relative;
  transition: all 0.7s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(${({ isChanging }) => (isChanging ? "30px" : "0px")});
    transition: backdrop-filter 0.7s ease-in-out;
    pointer-events: none;
  }

  @media (min-width: ${theme.breakpoints.desktop}) {
    align-items: flex-start;
  }
`;

const LoginContent = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  background-color: rgb(142, 175, 131, 0);

  @media (min-width: ${theme.breakpoints.desktop}) {
  }
`;

const LogoSection = styled.div`
  position: absolute;
  top: 25vh;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;

  // @media (min-width: ${theme.breakpoints.desktop}) {
  //   position: static;
  //   transform: none;
  //   text-align: left;
  //   margin-left: 3rem;
  // }
`;

const ButtonSection = styled.div`
  position: absolute;
  bottom: 15vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  width: 20rem;
  overflow: hidden;
`;

const SocialButtonsContainer = styled.div<{ show: boolean }>`
  display: flex;
  flex-direction: column;
  transform: translateY(${({ show }) => (show ? "0" : "100%")});
  opacity: ${({ show }) => (show ? "1" : "0")};
  transition: all 0.5s ease-in-out;
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
  // color: rgb(167, 234, 181);
  color: "white";
  margin-right: -2.5rem;
`;

const ChangeImageButton = styled.button`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: rotate(180deg);
  }

  svg {
    font-size: 1.25rem;
  }
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
  width: 100%;
  height: 3rem;
  padding: 0 1rem;
  border: none;
  border-radius: 0.75rem;
  background-color: #fee500;
  color: #000000;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #fee500;
    filter: brightness(0.95);
  }

  img {
    position: relative;
    width: 1.25rem;
    height: 1.25rem;
    margin-right: auto;
  }

  span {
    position: absolute;
    flex: 1;
    text-align: center;
    font-family: "Pretendard", sans-serif;
  }
`;

const NaverButton = styled.button`
  width: 100%;
  height: 3rem;
  padding: 0 1rem;
  border: none;
  border-radius: 0.75rem;
  background-color: #03c75a;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #03c75a;
    filter: brightness(0.95);
  }

  img {
    position: relative;
    width: 2rem;
    height: 2rem;
    margin-right: auto;
    left: -0.35rem;
  }

  span {
    position: absolute;
    flex: 1;
    text-align: center;
    font-family: "Pretendard", sans-serif;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  height: 3rem;
  padding: 0 1rem;
  border: 1px solid #dadce0;
  border-radius: 0.75rem;
  background-color: #ffffff;
  color: #3c4043;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #f8f9fa;
    border-color: #dadce0;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  }

  img {
    position: relative;
    width: 1.25rem;
    height: 1.25rem;
    margin-right: auto;
  }

  span {
    position: absolute;
    flex: 1;
    text-align: center;
    font-family: "Pretendard", sans-serif;
  }
`;

const LoginPage = () => {
  const [showSocialButtons, setShowSocialButtons] = useState(false);
  const [currentBg, setCurrentBg] = useState(5);
  const [isChanging, setIsChanging] = useState(false);
  const navigate = useNavigate();

  const handleChangeBackground = useCallback(() => {
    console.log("change");
    setIsChanging(true);
    setTimeout(() => {
      setCurrentBg((prev) => (prev % 5) + 1);
      setIsChanging(false);
    }, 500);
  }, []); // 의존성 없음

  useEffect(() => {
    const preloadImages = () => {
      const imageUrls = ["bg.png", "bg2.png", "bg3.png", "bg4.png", "bg5.png"];
      imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    };

    preloadImages();
  }, []);

  useEffect(() => {
    console.log("interval set");
    // 화면 자동 변경 시간 20초로 설정
    const intervalId = setInterval(handleChangeBackground, 20000);

    return () => {
      console.log("interval cleared");
      clearInterval(intervalId);
    };
  }, [handleChangeBackground]); // Add handleChangeBackground to dependencies

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
    <LoginContainer
      isChanging={isChanging}
      style={{
        background:
          currentBg === 5
            ? `linear-gradient(rgba(109, 190, 100, 1), rgba(109, 190, 100, 1))`
            : `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("bg${
                currentBg === 1 ? "" : currentBg
              }.png") no-repeat center center`,
      }}
    >
      <LoginContent>
        <ChangeImageButton onClick={handleChangeBackground}>
          <FiRefreshCw />
        </ChangeImageButton>
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
                <img src={KakaoIcon} alt="카카오 로고" />
                <span>카카오로 시작하기</span>
              </KakaoButton>
              <NaverButton onClick={handleNaverLogin}>
                <img src={NaverIcon} alt="네이버 로고" />
                <span>네이버로 시작하기</span>
              </NaverButton>
              <GoogleButton onClick={handleGoogleLogin}>
                <img src={GoogleIcon} alt="구글 로고" />
                <span>구글로 시작하기</span>
              </GoogleButton>
            </>
          )}
        </ButtonSection>
      </LoginContent>
    </LoginContainer>
  );
};

export default LoginPage;
