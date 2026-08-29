import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,

  // ── Set Auth (for Google OAuth) ──
  setAuth: (user, accessToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  // ── Login ──
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.login({ email, password });
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  // ── Register ──
  register: async (name, email, phone, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.register({ name, email, phone, password });
      set({ loading: false });
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  // ── Verify Email ──
  verifyEmail: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.verifyEmail({ email, otp });
      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed';
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  // ── Forgot Password ──
  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await authAPI.forgotPassword({ email });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset email';
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  // ── Reset Password ──
  resetPassword: async (token, newPassword) => {
    set({ loading: true, error: null });
    try {
      await authAPI.resetPassword({ token, newPassword });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed';
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  // ── Logout ──
  logout: async () => {
    try { await authAPI.logout(); } catch (e) { /* ignore */ }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  // ── Fetch current user ──
  fetchUser: async () => {
    try {
      const res = await authAPI.getMe();
      const user = res.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
