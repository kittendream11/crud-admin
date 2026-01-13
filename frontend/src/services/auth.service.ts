import { apiClient } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  user: UserData;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post('/v1/auth/login', credentials);
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post('/v1/auth/register', data);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post('/v1/auth/refresh', { refreshToken });
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/v1/auth/logout', {});
    } finally {
      apiClient.logout();
    }
  }

  async getCurrentUser(): Promise<UserData> {
    return apiClient.get('/v1/auth/me');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    apiClient.setTokens(accessToken, refreshToken);
  }
}

export const authService = new AuthService();

export default authService;
