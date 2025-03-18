const config = {
  kakao: {
    clientId: import.meta.env.VITE_KAKAO_CLIENT_ID,
    redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  },
} as const;

export default config; 