import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// ===========================================================================
// API CLIENT CONFIGURATION
// All requests are proxied through Next.js /api/* → FastAPI /api/*
// This avoids CORS entirely. See next.config.ts rewrites.
// ===========================================================================

const API_BASE_URL = '/api';

// Create the primary Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Token helpers — keep tokens in localStorage + sync to cookie for middleware
// ---------------------------------------------------------------------------
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },
  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    // Also write access_token to cookie so Next.js middleware can read it
    document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60 * 12}; SameSite=Lax`;
  },
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Clear cookie
    document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
  },
};

// ---------------------------------------------------------------------------
// Request Interceptor — Inject Bearer token
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Refresh token state — prevent concurrent refresh attempts
// ---------------------------------------------------------------------------
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

// ---------------------------------------------------------------------------
// Response Interceptor — Global error handling + silent token refresh
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // ── 401: Attempt silent refresh ──────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't auto-redirect if we are on the login or signup page requests
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/signup')) {
        return Promise.reject(buildApiError(error));
      }

      const refreshToken = tokenStorage.getRefreshToken();

      if (refreshToken) {
        if (isRefreshing) {
          // Queue this request until token refresh completes
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(apiClient(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const { access_token, refresh_token: new_refresh } =
            refreshResponse.data;

          tokenStorage.setTokens(access_token, new_refresh);
          onTokenRefreshed(access_token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return apiClient(originalRequest);
        } catch {
          // Refresh failed — clear session and redirect to login
          tokenStorage.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(buildApiError(error));
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token — redirect to login
        tokenStorage.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(buildApiError(error));
  }
);

// ---------------------------------------------------------------------------
// Standardised error builder
// ---------------------------------------------------------------------------
export interface ApiError {
  message: string;
  status: number | undefined;
  details: unknown;
  code?: string;
}

export function buildApiError(error: AxiosError): ApiError {
  const apiErr: ApiError = {
    message: 'An unexpected error occurred. Please try again.',
    status: error.response?.status,
    details: error.response?.data || {},
  };

  if (error.response) {
    const data = error.response.data as Record<string, unknown> | undefined;
    const backendDetail =
      (data?.detail as string) || (data?.message as string);

    switch (error.response.status) {
      case 400:
        apiErr.message =
          backendDetail || 'Invalid request. Please check your input.';
        break;
      case 401:
        apiErr.message = 'Session expired. Please log in again.';
        apiErr.code = 'UNAUTHORIZED';
        break;
      case 403:
        apiErr.message =
          'You do not have permission to access this resource.';
        apiErr.code = 'FORBIDDEN';
        break;
      case 404:
        apiErr.message = backendDetail || 'The requested resource was not found.';
        break;
      case 422:
        apiErr.message =
          'Validation failed. Please verify your input and try again.';
        break;
      case 429:
        apiErr.message =
          'Too many requests. Please wait a moment before trying again.';
        break;
      case 500:
        apiErr.message = 'Internal server error. Our team has been notified.';
        break;
      case 502:
      case 503:
        apiErr.message =
          'Service temporarily unavailable. Please try again shortly.';
        break;
    }
  } else if (error.request) {
    apiErr.message =
      'Network error. Please check your internet connection and try again.';
    apiErr.code = 'NETWORK_ERROR';
  }

  console.error('[API Error]:', apiErr);
  return apiErr;
}

// ---------------------------------------------------------------------------
// Utility: retry wrapper with exponential backoff
// ---------------------------------------------------------------------------
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  baseDelayMs = 500
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
  throw lastError;
}

// Legacy mock mode flag — kept false for real backend integration
export const IS_MOCK_MODE = false;
// Kept for any remaining references in older service files
export const simulateNetworkDelay = (_ms: number = 0): Promise<void> =>
  Promise.resolve();
