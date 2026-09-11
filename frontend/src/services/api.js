import axios from 'axios';
import { handleMockRequest } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15 seconds for production reliability
});

// ── Retry Logic with Exponential Backoff ──
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error) => {
  if (!error.response) return true; // network error
  const status = error.response.status;
  return status === 408 || status === 429 || status >= 500;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;

    // Retry on network errors or 5xx (not on auth errors)
    if (shouldRetry(error) && config.__retryCount < MAX_RETRIES && config.method === 'get') {
      config.__retryCount += 1;
      const delay = RETRY_DELAY_MS * Math.pow(2, config.__retryCount - 1);
      console.info(`🔄 Retry ${config.__retryCount}/${MAX_RETRIES} after ${delay}ms — ${config.url}`);
      await sleep(delay);
      return api(config);
    }

    return Promise.reject(error);
  }
);

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && !token.startsWith('mock-')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 / refresh token / mock fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ── Network Error → Fall back to Mock Data ──
    if (!error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.info('%c🔄 Backend unavailable — using mock data', 'color: #ff9900; font-weight: bold;');
      try {
        const mockResponse = handleMockRequest(originalRequest);
        return mockResponse;
      } catch (mockErr) {
        console.warn('Mock handler error:', mockErr);
        return Promise.reject(error);
      }
    }

    // ── 401 → Try refresh token ──
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && !refreshToken.startsWith('mock-')) {
          const res = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════
// AUTH API
// ═══════════════════════════════════
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verifyEmail: (data) => api.post('/api/auth/verify-email', data),
  resendOtp: (data) => api.post('/api/auth/resend-otp', data),
  googleLogin: (data) => api.post('/api/auth/google-login', data),
  sendPhoneOtp: (data) => api.post('/api/auth/phone-login/send-otp', data),
  verifyPhoneOtp: (data) => api.post('/api/auth/phone-login/verify-otp', data),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
  refreshToken: (data) => api.post('/api/auth/refresh', data),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
};

// ═══════════════════════════════════
// PRODUCT API
// ═══════════════════════════════════
export const productAPI = {
  getProducts: (params) => api.get('/api/products', { params }),
  getProduct: (id) => api.get(`/api/products/${id}`),
  searchProducts: (q, page = 0, size = 20) => api.get('/api/products/search', { params: { q, page, size } }),
  getFeatured: () => api.get('/api/products/featured'),
  getDeals: () => api.get('/api/products/deals-of-the-day'),
  getSimilar: (id) => api.get(`/api/products/${id}/similar`),
  getReviews: (id, page = 0, size = 10) => api.get(`/api/products/${id}/reviews`, { params: { page, size } }),
  addReview: (id, data) => api.post(`/api/products/${id}/reviews`, data),
  createProduct: (data) => api.post('/api/products', data),
  getBrands: (categoryId) => api.get('/api/products/brands', { params: { categoryId } }),
};

// ═══════════════════════════════════
// CATEGORY API
// ═══════════════════════════════════
export const categoryAPI = {
  getCategories: () => api.get('/api/categories'),
  getSubcategories: (id) => api.get(`/api/categories/${id}/subcategories`),
  getCategoryBySlug: (slug) => api.get(`/api/categories/slug/${slug}`),
};

// ═══════════════════════════════════
// CART API
// ═══════════════════════════════════
export const cartAPI = {
  getCart: () => api.get('/api/cart'),
  addToCart: (data) => api.post('/api/cart/items', data),
  updateCartItem: (id, data) => api.put(`/api/cart/items/${id}`, data),
  removeCartItem: (id) => api.delete(`/api/cart/items/${id}`),
  saveForLater: (id) => api.post(`/api/cart/save-for-later/${id}`),
  moveToCart: (id) => api.post(`/api/cart/move-to-cart/${id}`),
  clearCart: () => api.delete('/api/cart/clear'),
};

// ═══════════════════════════════════
// ORDER API
// ═══════════════════════════════════
export const orderAPI = {
  checkout: (data) => api.post('/api/orders/checkout', data),
  getOrders: (page = 0, size = 10) => api.get('/api/orders', { params: { page, size } }),
  getOrder: (id) => api.get(`/api/orders/${id}`),
  getOrderByNumber: (num) => api.get(`/api/orders/number/${num}`),
  cancelOrder: (id, reason) => api.post(`/api/orders/${id}/cancel`, { reason }),
};

// ═══════════════════════════════════
// ADDRESS API
// ═══════════════════════════════════
export const addressAPI = {
  getAddresses: () => api.get('/api/addresses'),
  addAddress: (data) => api.post('/api/addresses', data),
  updateAddress: (id, data) => api.put(`/api/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/api/addresses/${id}`),
};

// ═══════════════════════════════════
// WISHLIST API
// ═══════════════════════════════════
export const wishlistAPI = {
  getWishlist: () => api.get('/api/wishlist'),
  addToWishlist: (productId) => api.post(`/api/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/api/wishlist/${productId}`),
};

// ═══════════════════════════════════
// RETURN API
// ═══════════════════════════════════
export const returnAPI = {
  submitReturn: (data) => api.post('/api/returns', data),
  getReturns: (page = 0, size = 10) => api.get('/api/returns', { params: { page, size } }),
  getReturnByOrder: (orderId) => api.get(`/api/returns/order/${orderId}`),
};

// ═══════════════════════════════════
// PROFILE API
// ═══════════════════════════════════
export const profileAPI = {
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
};

// ═══════════════════════════════════
// COUPON API
// ═══════════════════════════════════
export const couponAPI = {
  validate: (code, subtotal) => api.post('/api/coupons/validate', { code, subtotal }),
};

export default api;
