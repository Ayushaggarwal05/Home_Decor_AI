import { apiClient, tokenStorage } from './api';
import { TokenResponse, BackendUser } from '../types';

// ===========================================================================
// AUTH SERVICE — Connects to FastAPI /api/auth/* endpoints
// ===========================================================================

export interface SignupPayload {
  email: string;
  password: string;
  full_name?: string;
  tier?: string;
}

export const authService = {
  /**
   * POST /api/auth/login
   * FastAPI expects OAuth2PasswordRequestForm → application/x-www-form-urlencoded
   */
  async login(email: string, password: string): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 spec uses 'username' field
    formData.append('password', password);

    const response = await apiClient.post<TokenResponse>(
      '/auth/login',
      formData.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, refresh_token } = response.data;
    tokenStorage.setTokens(access_token, refresh_token);

    return response.data;
  },

  /**
   * POST /api/auth/signup
   */
  async signup(payload: SignupPayload): Promise<BackendUser> {
    const response = await apiClient.post<BackendUser>(
      '/auth/signup',
      payload
    );
    return response.data;
  },

  /**
   * POST /api/auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token } = response.data;
    tokenStorage.setTokens(access_token, refresh_token);

    return response.data;
  },

  /**
   * GET /api/auth/me
   */
  async getMe(): Promise<BackendUser> {
    const response = await apiClient.get<BackendUser>('/auth/me');
    return response.data;
  },

  /**
   * Clear session tokens
   */
  logout(): void {
    tokenStorage.clearTokens();
  },
};
