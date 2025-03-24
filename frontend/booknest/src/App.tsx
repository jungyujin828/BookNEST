import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ROUTES } from "./constants/paths";
import LoginPage from "./pages/LoginPage";
import InputInfoPage from "./pages/InputInfoPage";
import KakaoCallback from "./components/KakaoCallback";
import NaverCallback from "./components/NaverCallback";
import GoogleCallback from "./components/GoogleCallback";
import HomePage from "./pages/HomePage";
import TodaysPage from "./pages/TodaysPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EvaluateBookPage from "./pages/EvaluateBookPage";
import SearchPage from "./pages/SearchPage";
import NestPage from "./pages/NestPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import ErrorPage from "./pages/ErrorPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* 공개 라우트 */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.INPUT_INFO} element={<InputInfoPage />} />
        <Route path={ROUTES.KAKAO_CALLBACK} element={<KakaoCallback />} />
        <Route path={ROUTES.NAVER_CALLBACK} element={<NaverCallback />} />
        <Route path={ROUTES.GOOGLE_CALLBACK} element={<GoogleCallback />} />

        {/* 보호된 라우트 */}
        {/* 정보입력페이지 */}
        <Route
          path={ROUTES.INPUT_INFO}
          element={
            <ProtectedRoute>
              <InputInfoPage />
            </ProtectedRoute>
          }
        />

        {/* 책평가페이지 */}
        <Route
          path={ROUTES.EVALUATE_BOOK}
          element={
            <ProtectedRoute>
              <EvaluateBookPage />
            </ProtectedRoute>
          }
        />

        {/* 검색페이지 */}
        <Route
          path={ROUTES.SEARCH}
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        {/* 오늘의 책 */}
        <Route
          path={ROUTES.TODAYS}
          element={
            <ProtectedRoute>
              <TodaysPage />
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

        {/* 둥지페이지 */}
        <Route
          path={ROUTES.NEST}
          element={
            <ProtectedRoute>
              <NestPage />
            </ProtectedRoute>
          }
        />

        {/* 프로필페이지 */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 기본 경로를 로그인페이지로 연결 */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 잘못된 경로는 에러 페이지로 연결 */}
        <Route path="*" element={<ErrorPage />} />
        <Route path="/input-info" element={<InputInfoPage />} />
        {/* 🗑️ */}
      </Routes>
      <Navbar />
    </Router>
  );
}

export default App;
