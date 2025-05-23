const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  authTokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token'
};

export default config; 