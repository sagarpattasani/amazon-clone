import { describe, it, expect } from 'vitest';
import { handleMockRequest } from '../services/mockApi.js';

describe('mockApi', () => {
  it('should return categories', () => {
    const result = handleMockRequest({ url: '/api/categories', method: 'get' });
    expect(result.data.success).toBe(true);
    expect(Array.isArray(result.data.data)).toBe(true);
    expect(result.data.data.length).toBeGreaterThan(0);
  });

  it('should return products with pagination', () => {
    const result = handleMockRequest({ url: '/api/products', method: 'get', params: {} });
    expect(result.data.success).toBe(true);
    expect(result.data.data.content).toBeDefined();
    expect(result.data.data.totalElements).toBeGreaterThan(0);
  });

  it('should return a single product by id', () => {
    const result = handleMockRequest({ url: '/api/products/1', method: 'get' });
    expect(result.data.success).toBe(true);
    expect(result.data.data.id).toBe(1);
    expect(result.data.data.title).toBeDefined();
  });

  it('should return mock user on login', () => {
    const result = handleMockRequest({
      url: '/api/auth/login',
      method: 'post',
      data: JSON.stringify({ email: 'test@test.com', password: 'test123' }),
    });
    expect(result.data.success).toBe(true);
    expect(result.data.data.accessToken).toBeDefined();
  });

  it('should validate a valid coupon', () => {
    const result = handleMockRequest({
      url: '/api/coupons/validate',
      method: 'post',
      data: JSON.stringify({ code: 'SAVE10', subtotal: 1000 }),
    });
    expect(result.data.success).toBe(true);
    expect(result.data.data.discount).toBe(100); // 10% of 1000
  });

  it('should reject invalid coupon', () => {
    const result = handleMockRequest({
      url: '/api/coupons/validate',
      method: 'post',
      data: JSON.stringify({ code: 'INVALID', subtotal: 1000 }),
    });
    expect(result.data.success).toBe(false);
  });

  it('should reject expired coupon', () => {
    const result = handleMockRequest({
      url: '/api/coupons/validate',
      method: 'post',
      data: JSON.stringify({ code: 'EXPIRED20', subtotal: 1000 }),
    });
    expect(result.data.success).toBe(false);
    expect(result.data.message).toContain('expired');
  });

  it('should cap coupon discount at maxDiscount', () => {
    const result = handleMockRequest({
      url: '/api/coupons/validate',
      method: 'post',
      data: JSON.stringify({ code: 'SAVE10', subtotal: 5000 }),
    });
    expect(result.data.data.discount).toBe(200); // max ₹200
  });

  it('should reject coupon below minOrder', () => {
    const result = handleMockRequest({
      url: '/api/coupons/validate',
      method: 'post',
      data: JSON.stringify({ code: 'FLAT500', subtotal: 100 }),
    });
    expect(result.data.success).toBe(false);
    expect(result.data.message).toContain('Minimum');
  });

  it('should handle review submission', () => {
    const result = handleMockRequest({
      url: '/api/products/1/reviews',
      method: 'post',
      data: JSON.stringify({ rating: 5, reviewTitle: 'Great!', reviewBody: 'Love it' }),
    });
    expect(result.data.success).toBe(true);
    expect(result.data.data.rating).toBe(5);
    expect(result.data.data.verifiedPurchase).toBe(true);
  });

  it('should return cart items', () => {
    const result = handleMockRequest({ url: '/api/cart', method: 'get' });
    expect(result.data.success).toBe(true);
    expect(result.data.data.items).toBeDefined();
  });

  it('should handle profile update', () => {
    const result = handleMockRequest({
      url: '/api/auth/profile',
      method: 'put',
      data: JSON.stringify({ name: 'New Name' }),
    });
    expect(result.data.success).toBe(true);
  });
});
