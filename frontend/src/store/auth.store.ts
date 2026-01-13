import { create } from 'zustand';
import { UserData, authService } from '@/services/auth.service';

export interface AuthStore {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      authService.setTokens(response.accessToken, response.refreshToken);
      set({ user: response.user, isAuthenticated: true });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, firstName: string, lastName: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({
        email,
        firstName,
        lastName,
        password,
      });
      authService.setTokens(response.accessToken, response.refreshToken);
      set({ user: response.user, isAuthenticated: true });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Logout failed';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
