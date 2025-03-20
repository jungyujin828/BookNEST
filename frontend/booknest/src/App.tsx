import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InputInfoPage from "./pages/InputInfoPage";
import KakaoCallback from "./components/KakaoCallback";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./constants/paths";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

        {/* 보호된 라우트 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* 잘못된 경로는 메인 페이지로 리다이렉트 */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        <Route path="/input-info" element={<InputInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
