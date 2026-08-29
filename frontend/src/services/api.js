import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
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
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  googleLogin: (data) => api.post('/auth/google-login', data),
  sendPhoneOtp: (data) => api.post('/auth/phone-login/send-otp', data),
  verifyPhoneOtp: (data) => api.post('/auth/phone-login/verify-otp', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  refreshToken: (data) => api.post('/auth/refresh', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// ═══════════════════════════════════
// PRODUCT API
// ═══════════════════════════════════
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  searchProducts: (q, page = 0, size = 20) => api.get('/products/search', { params: { q, page, size } }),
  getFeatured: () => api.get('/products/featured'),
  getDeals: () => api.get('/products/deals-of-the-day'),
  getSimilar: (id) => api.get(`/products/${id}/similar`),
  getReviews: (id, page = 0, size = 10) => api.get(`/products/${id}/reviews`, { params: { page, size } }),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  createProduct: (data) => api.post('/products', data),
  getBrands: (categoryId) => api.get('/products/brands', { params: { categoryId } }),
};

// ═══════════════════════════════════
// CATEGORY API
// ═══════════════════════════════════
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getSubcategories: (id) => api.get(`/categories/${id}/subcategories`),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

// ═══════════════════════════════════
// CART API
// ═══════════════════════════════════
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/items', data),
  updateCartItem: (id, data) => api.put(`/cart/items/${id}`, data),
  removeCartItem: (id) => api.delete(`/cart/items/${id}`),
  saveForLater: (id) => api.post(`/cart/save-for-later/${id}`),
  moveToCart: (id) => api.post(`/cart/move-to-cart/${id}`),
  clearCart: () => api.delete('/cart/clear'),
};

// ═══════════════════════════════════
// ORDER API
// ═══════════════════════════════════
export const orderAPI = {
  checkout: (data) => api.post('/orders/checkout', data),
  getOrders: (page = 0, size = 10) => api.get('/orders', { params: { page, size } }),
  getOrder: (id) => api.get(`/orders/${id}`),
  getOrderByNumber: (num) => api.get(`/orders/number/${num}`),
  cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
};

// ═══════════════════════════════════
// ADDRESS API
// ═══════════════════════════════════
export const addressAPI = {
  getAddresses: () => api.get('/addresses'),
  addAddress: (data) => api.post('/addresses', data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
};

// ═══════════════════════════════════
// WISHLIST API
// ═══════════════════════════════════
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

export default api;
