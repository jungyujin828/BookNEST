export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  KAKAO_CALLBACK: '/auth/kakao/callback',
  SIGNUP: '/signup',
} as const;

export const API_PATHS = {
  KAKAO_LOGIN: '/api/auth/kakao/callback',
} as const;

export const ASSETS = {
  ICONS: {
    KAKAO: '/icons/kakao-icon.png',
    NAVER: '/icons/naver-icon.png',
    GOOGLE: '/icons/google-icon.png',
  },
} as const;

export const OAUTH = {
  KAKAO: {
    AUTH_URL: 'https://kauth.kakao.com/oauth/authorize',
  },
} as const; 