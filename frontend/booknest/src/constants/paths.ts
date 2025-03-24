export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  KAKAO_CALLBACK: '/auth/kakao/callback',
  NAVER_CALLBACK: '/auth/naver/callback',
  GOOGLE_CALLBACK: '/auth/google/callback',
  SIGNUP: '/signup',
} as const;

export const API_PATHS = {
  KAKAO_LOGIN: '/api/auth/kakao/callback',
  NAVER_LOGIN: '/api/auth/naver/callback',
  GOOGLE_LOGIN: '/api/auth/google/callback',
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
  NAVER: {
    AUTH_URL: 'https://nid.naver.com/oauth2.0/authorize',
  },
  GOOGLE: {
    AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
    SCOPE: 'email profile',
  },
} as const; 