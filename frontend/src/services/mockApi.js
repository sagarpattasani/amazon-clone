// ═══════════════════════════════════════════════════
// Amazon Clone — Mock API Interceptor
// Falls back to mock data when backend is unavailable
// ═══════════════════════════════════════════════════

import {
  products, categories, reviews, mockUser, mockAddresses,
  mockCart, mockOrders, mockNotifications, adminDashboard,
  sellerDashboard, getSearchSuggestions, filterProducts, getBrands, coupons,
} from './mockData.js';

const ok = (data) => ({ data: { success: true, data, message: 'OK' } });
const paginate = (data) => ok(data);

// Clone cart so mutations don't affect the original
let cart = JSON.parse(JSON.stringify(mockCart));
let isLoggedIn = !!localStorage.getItem('accessToken');

export function handleMockRequest(config) {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const params = config.params || {};

  // Normalize URL — remove leading /api if present (since baseURL already includes it)
  const path = url.replace(/^\/api/, '').replace(/^\//, '');

  // ── AUTH ──
  if (path === 'auth/login' && method === 'post') {
    const user = { ...mockUser };
    isLoggedIn = true;
    localStorage.setItem('accessToken', 'mock-jwt-token-' + Date.now());
    localStorage.setItem('refreshToken', 'mock-refresh-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(user));
    return ok({ accessToken: 'mock-jwt-token', refreshToken: 'mock-refresh-token', user });
  }
  if (path === 'auth/register' && method === 'post') {
    return ok({ message: 'Registration successful. OTP sent.' });
  }
  if (path === 'auth/verify-email' && method === 'post') {
    const user = { ...mockUser };
    return ok({ accessToken: 'mock-jwt-token', refreshToken: 'mock-refresh-token', user });
  }
  if (path === 'auth/google' && method === 'post') {
    const user = { ...mockUser, name: 'Google User' };
    return ok({ accessToken: 'mock-jwt-token', refreshToken: 'mock-refresh-token', user });
  }
  if (path === 'auth/me' && method === 'get') {
    return ok(mockUser);
  }
  if (path === 'auth/forgot-password' && method === 'post') {
    return ok({ message: 'Reset email sent' });
  }
  if (path === 'auth/logout' && method === 'post') {
    isLoggedIn = false;
    return ok({ message: 'Logged out' });
  }
  if (path === 'auth/refresh' && method === 'post') {
    return ok({ accessToken: 'mock-jwt-refreshed-' + Date.now(), refreshToken: 'mock-refresh-' + Date.now() });
  }

  // ── CATEGORIES ──
  if (path === 'categories' && method === 'get') {
    return ok(categories);
  }
  if (path.match(/^categories\/\d+\/subcategories$/)) {
    return ok([]);
  }
  if (path.match(/^categories\/slug\/.+$/)) {
    const slug = path.split('/').pop();
    return ok(categories.find(c => c.slug === slug) || null);
  }

  // ── PRODUCTS ──
  if (path === 'products' && method === 'get') {
    return ok(filterProducts(params));
  }
  if (path === 'products/featured' && method === 'get') {
    return ok(products.filter(p => p.isFeatured));
  }
  if (path === 'products/deals-of-the-day' && method === 'get') {
    return ok(products.filter(p => p.isDealOfDay));
  }
  if (path === 'products/search' && method === 'get') {
    return ok(filterProducts({ ...params, q: params.q }));
  }
  if (path === 'products/brands' && method === 'get') {
    return ok(getBrands(params.categoryId));
  }
  if (path.match(/^products\/\d+\/similar$/)) {
    const id = parseInt(path.split('/')[1]);
    const product = products.find(p => p.id === id);
    if (product) {
      return ok(products.filter(p => p.categoryId === product.categoryId && p.id !== id).slice(0, 6));
    }
    return ok([]);
  }
  if (path.match(/^products\/\d+\/reviews$/) && method === 'get') {
    const id = parseInt(path.split('/')[1]);
    const productReviews = reviews.filter(r => r.productId === id);
    return ok({ content: productReviews, totalElements: productReviews.length, totalPages: 1 });
  }
  if (path.match(/^products\/\d+$/) && method === 'get') {
    const id = parseInt(path.split('/').pop());
    const product = products.find(p => p.id === id);
    if (product) return ok({ ...product, inWishlist: false });
    return ok(null);
  }

  // ── CART ──
  if (path === 'cart' && method === 'get') {
    return ok(cart);
  }
  if (path === 'cart/items' && method === 'post') {
    const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
    const product = products.find(p => p.id === body.productId);
    if (product) {
      const existing = cart.items.find(i => i.productId === body.productId);
      if (existing) {
        existing.quantity += body.quantity || 1;
      } else {
        cart.items.push({
          id: Date.now(), productId: product.id, productTitle: product.title,
          productImage: product.primaryImage, brand: product.brand,
          price: product.price, mrp: product.mrp,
          quantity: body.quantity || 1, inStock: true,
        });
      }
      cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    }
    return ok(cart);
  }
  if (path.match(/^cart\/items\/\d+$/) && method === 'put') {
    const id = parseInt(path.split('/').pop());
    const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
    const item = cart.items.find(i => i.id === id);
    if (item) item.quantity = body.quantity || 1;
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    return ok(cart);
  }
  if (path.match(/^cart\/items\/\d+$/) && method === 'delete') {
    const id = parseInt(path.split('/').pop());
    cart.items = cart.items.filter(i => i.id !== id);
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    return ok(cart);
  }
  if (path === 'cart/clear' && method === 'delete') {
    cart = { id: 1, items: [], savedForLater: [], subtotal: 0, totalItems: 0 };
    return ok(cart);
  }
  if (path.match(/^cart\/save-for-later\/\d+$/) && method === 'post') {
    const id = parseInt(path.split('/').pop());
    const item = cart.items.find(i => i.id === id);
    if (item) {
      cart.items = cart.items.filter(i => i.id !== id);
      if (!cart.savedForLater) cart.savedForLater = [];
      cart.savedForLater.push(item);
      cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    }
    return ok(cart);
  }
  if (path.match(/^cart\/move-to-cart\/\d+$/) && method === 'post') {
    const id = parseInt(path.split('/').pop());
    const item = (cart.savedForLater || []).find(i => i.id === id);
    if (item) {
      cart.savedForLater = cart.savedForLater.filter(i => i.id !== id);
      cart.items.push({ ...item, quantity: 1 });
      cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    }
    return ok(cart);
  }

  // ── ORDERS ──
  if (path === 'orders' && method === 'get') {
    return ok({ content: mockOrders, totalElements: mockOrders.length, totalPages: 1 });
  }
  if (path.match(/^orders\/\d+$/) && method === 'get') {
    const id = parseInt(path.split('/').pop());
    return ok(mockOrders.find(o => o.id === id) || mockOrders[0]);
  }
  if (path === 'orders/checkout' && method === 'post') {
    const newOrder = {
      ...mockOrders[0], id: Date.now(), orderNumber: `AMZ-${Date.now()}`,
      status: 'PENDING', createdAt: new Date().toISOString(),
    };
    return ok(newOrder);
  }
  if (path.match(/^orders\/\d+\/cancel$/) && method === 'post') {
    return ok({ ...mockOrders[0], status: 'CANCELLED' });
  }

  // ── ADDRESSES ──
  if (path === 'addresses' && method === 'get') {
    return ok(mockAddresses);
  }
  if (path === 'addresses' && method === 'post') {
    const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
    const newAddr = { id: Date.now(), userId: 2, ...body, country: 'India', isDefault: false };
    mockAddresses.push(newAddr);
    return ok(newAddr);
  }

  // ── WISHLIST ──
  if (path === 'wishlist' && method === 'get') {
    return ok(products.slice(0, 4));
  }
  if (path.match(/^wishlist\/\d+$/) && method === 'post') {
    return ok({ message: 'Added to wishlist' });
  }
  if (path.match(/^wishlist\/\d+$/) && method === 'delete') {
    return ok({ message: 'Removed from wishlist' });
  }

  // ── NOTIFICATIONS ──
  if (path.match(/^notifications(\?.*)?$/) && method === 'get') {
    return ok(mockNotifications);
  }
  if (path === 'notifications/unread-count' && method === 'get') {
    return ok({ count: mockNotifications.filter(n => !n.isRead).length });
  }
  if (path.match(/^notifications\/\d+\/read$/) && method === 'put') {
    return ok({ message: 'Marked as read' });
  }
  if (path === 'notifications/read-all' && method === 'put') {
    mockNotifications.forEach(n => n.isRead = true);
    return ok({ message: 'All marked as read' });
  }

  // ── SEARCH ──
  if (path.match(/^search\/suggestions/) && method === 'get') {
    return ok(getSearchSuggestions(params.q || ''));
  }

  // ── ADMIN ──
  if (path === 'admin/dashboard' && method === 'get') {
    return ok(adminDashboard);
  }
  if (path.match(/^admin\/users/) && method === 'get') {
    return ok({
      content: [
        { id: 1, name: 'Admin User', email: 'admin@amazonclone.com', role: 'SUPER_ADMIN', isActive: true },
        { id: 2, name: 'Test Customer', email: 'customer@test.com', role: 'CUSTOMER', isActive: true },
        { id: 3, name: 'Seller One', email: 'seller1@test.com', role: 'SELLER', isActive: true },
        { id: 4, name: 'Seller Two', email: 'seller2@test.com', role: 'SELLER', isActive: true },
      ],
      totalElements: 4, totalPages: 1,
    });
  }
  if (path.match(/^admin\/orders/) && method === 'get') {
    return ok({ content: mockOrders, totalElements: mockOrders.length, totalPages: 1 });
  }
  if (path.match(/^admin\/returns/) && method === 'get') {
    return ok({ content: [], totalElements: 0, totalPages: 0 });
  }
  if (path.match(/^admin\/orders\/\d+\/status/) && method === 'put') {
    return ok({ message: 'Status updated' });
  }
  if (path.match(/^admin\/users\/\d+\/toggle-status/) && method === 'put') {
    return ok({ message: 'User status toggled' });
  }

  // ── SELLER ──
  if (path === 'seller/dashboard' && method === 'get') {
    return ok(sellerDashboard);
  }
  if (path.match(/^seller\/products/) && method === 'get') {
    const sellerProducts = products.filter(p => p.seller?.businessName === 'TechVault India');
    return ok({ content: sellerProducts, totalElements: sellerProducts.length, totalPages: 1 });
  }
  if (path.match(/^seller\/orders/) && method === 'get') {
    return ok({ content: [], totalElements: 0, totalPages: 0 });
  }
  if (path === 'seller/register' && method === 'post') {
    return ok({ message: 'Seller registered successfully' });
  }

  // ── RETURNS ──
  if (path === 'returns' && method === 'post') {
    const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
    const newReturn = {
      id: Date.now(),
      orderId: body.orderId,
      reason: body.reason,
      description: body.description,
      status: 'REQUESTED',
      refundAmount: null,
      createdAt: new Date().toISOString(),
    };
    return ok(newReturn);
  }
  if (path === 'returns' && method === 'get') {
    return ok({ content: [], totalElements: 0, totalPages: 0 });
  }
  if (path.match(/^returns\/order\/\d+$/) && method === 'get') {
    return ok(null);
  }

  // ── PROFILE ──
  if (path === 'auth/profile' && method === 'put') {
    const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
    const updatedUser = { ...mockUser, ...body };
    Object.assign(mockUser, body);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return ok(updatedUser);
  }
  if (path === 'auth/change-password' && method === 'put') {
    return ok({ message: 'Password changed successfully' });
  }

  // ── COUPON VALIDATION ──
  if (path === 'coupons/validate' && method === 'post') {
    const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
    const code = (body.code || '').toUpperCase().trim();
    const subtotal = body.subtotal || 0;
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) return { data: { success: false, message: 'Invalid coupon code', data: null } };
    if (!coupon.active) return { data: { success: false, message: 'This coupon has expired', data: null } };
    if (subtotal < coupon.minOrder) return { data: { success: false, message: `Minimum order of ₹${coupon.minOrder} required`, data: null } };
    let discount = coupon.type === 'PERCENT' ? Math.round(subtotal * coupon.value / 100) : coupon.value;
    discount = Math.min(discount, coupon.maxDiscount);
    return ok({ discount, code: coupon.code, description: coupon.description });
  }

  // ── REVIEW SUBMISSION ──
  if (path.match(/^products\/\d+\/reviews$/) && method === 'post') {
    const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};
    const newReview = {
      id: Date.now(),
      userName: mockUser.name || 'Customer',
      rating: body.rating,
      reviewTitle: body.reviewTitle,
      reviewBody: body.reviewBody,
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
    };
    return ok(newReview);
  }

  // ── Fallback ──
  return ok(null);
}
