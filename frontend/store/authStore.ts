import { create } from 'zustand';
import { AuthUser, TokenResponse } from '../types';
import { authService, SignupPayload } from '../services/auth.service';
import { mapBackendUser } from '../lib/mappers';
import { tokenStorage } from '../services/api';

// ===========================================================================
// AUTH STORE — Zustand store for session, tokens, and user identity
// ===========================================================================

interface AuthState {
  // State
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  hydrateFromStorage: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // ── Initial state ──────────────────────────────────────────────────────
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // ── Login ──────────────────────────────────────────────────────────────
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const tokens: TokenResponse = await authService.login(email, password);
      set({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        isAuthenticated: true,
      });
      // Load user profile
      await get().fetchMe();
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message || 'Login failed. Please check your credentials.';
      set({ error: msg, isAuthenticated: false });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Signup ─────────────────────────────────────────────────────────────
  signup: async (payload: SignupPayload) => {
    set({ isLoading: true, error: null });
    try {
      await authService.signup(payload);
      // Auto-login after successful signup
      await get().login(payload.email, payload.password);
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message || 'Signup failed. Please try again.';
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Logout ─────────────────────────────────────────────────────────────
  logout: () => {
    authService.logout();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  // ── Fetch current user profile ─────────────────────────────────────────
  fetchMe: async () => {
    try {
      const rawUser = await authService.getMe();
      const user = mapBackendUser(rawUser);
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  // ── Hydrate from localStorage on app mount ─────────────────────────────
  hydrateFromStorage: async () => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (!accessToken) {
      set({ isAuthenticated: false });
      return;
    }

    set({ accessToken, refreshToken });

    // Verify token is still valid by fetching user profile
    try {
      const rawUser = await authService.getMe();
      const user = mapBackendUser(rawUser);
      set({ user, isAuthenticated: true });
    } catch {
      // Token expired or invalid — clear storage
      tokenStorage.clearTokens();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },

  // ── Clear error ────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),
}));
