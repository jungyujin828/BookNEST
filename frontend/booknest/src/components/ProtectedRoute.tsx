import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/paths";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  console.log("보호된 라우트 - 토큰:", token); // 디버깅 로그 한글화

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    console.log("보호된 라우트 - 토큰이 없음, 로그인 페이지로 이동"); // 디버깅 로그 한글화
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  console.log("보호된 라우트 - 토큰 확인됨, 컴포넌트 렌더링"); // 디버깅 로그 한글화
  return <>{children}</>;
};

export default ProtectedRoute;
