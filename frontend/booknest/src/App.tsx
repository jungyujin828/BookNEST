import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Header /> {/* 여기에 헤더 추가 */}
      <Routes>
        {/* 공개 라우트 */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.KAKAO_CALLBACK} element={<KakaoCallback />} />
        <Route path={ROUTES.NAVER_CALLBACK} element={<NaverCallback />} />
        <Route path={ROUTES.GOOGLE_CALLBACK} element={<GoogleCallback />} />

        {/* 보호된 라우트 */}
        {/* 정보입력페이지 */}
        <Route
          path="/input-info"
          element={
            <ProtectedRoute>
              <InputInfoPage />
            </ProtectedRoute>
          }
        />

        {/* 책평가페이지 */}
        <Route
          path="/eval-book"
          element={
            <ProtectedRoute>
              <EvaluateBookPage />
            </ProtectedRoute>
          }
        />

        {/* 메인페이지 */}
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* 잘못된 경로는 메인 페이지로 리다이렉트 */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path="/input-info" element={<InputInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
