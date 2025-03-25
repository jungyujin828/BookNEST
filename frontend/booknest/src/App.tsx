import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./constants/paths";
import LoginPage from "./pages/LoginPage";
import InputInfoPage from "./pages/InputInfoPage";
import KakaoCallback from "./components/KakaoCallback";
import NaverCallback from "./components/NaverCallback";
import GoogleCallback from "./components/GoogleCallback";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import EvaluateBookPage from "./pages/EvaluateBookPage";
import "./App.css";

// 개발 환경에서 테스트용 토큰 설정
if (import.meta.env.DEV && !localStorage.getItem('token')) {
  const testUser = {
    id: "test-user-id",
    nickname: "테스트 사용자",
    isNew: false
  };
  localStorage.setItem('token', 'test-access-token');
  localStorage.setItem('user', JSON.stringify(testUser));
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* 공개 라우트 */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.KAKAO_CALLBACK} element={<KakaoCallback />} />
        <Route path={ROUTES.NAVER_CALLBACK} element={<NaverCallback />} />
        <Route path={ROUTES.GOOGLE_CALLBACK} element={<GoogleCallback />} />

        {/* 보호된 라우트 */}
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.INPUT_INFO}
          element={
            <ProtectedRoute>
              <InputInfoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/eval-book"
          element={
            <ProtectedRoute>
              <EvaluateBookPage />
            </ProtectedRoute>
          }
        />

        {/* 기본 라우트 */}
        <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
