import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface UserDetailInfo {
  nickname: string;
  gender: string;
  birthDate: string;
  roadAddress: string;
  zipcode: string;
  followers: number;

  followings: number;
  totalRatings: number;
  totalReviews: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  userDetail: UserDetailInfo | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setUserDetail: (userDetail: UserDetailInfo | null) => void;
  login: (token: string, user: User, userDetail?: UserDetailInfo) => void;
  logout: () => void;
}

// localStorage에서 초기 상태 가져오기
const getInitialState = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user: User | null = null;

  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
  }

  return {
    token,
    user,
    isAuthenticated: !!token,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...getInitialState(),
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      userDetail: null,
      setUserDetail: (userDetail) => set({ userDetail }),
      login: (token, user, userDetail = null) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        if (userDetail) {
          localStorage.setItem("userDetail", JSON.stringify(userDetail));
        }
        set({
          token,
          user,
          userDetail,
          isAuthenticated: true,
        });
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userDetail");
        set({
          token: null,
          user: null,
          userDetail: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
