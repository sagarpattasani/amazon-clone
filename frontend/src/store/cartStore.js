import { create } from 'zustand';
import { cartAPI } from '../services/api';

const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,
  itemCount: 0,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await cartAPI.getCart();
      const cart = res.data.data;
      set({ cart, itemCount: cart.totalItems || 0, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1, variantId = null) => {
    try {
      const res = await cartAPI.addToCart({ productId, quantity, variantId });
      const cart = res.data.data;
      set({ cart, itemCount: cart.totalItems || 0 });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
    }
  },

  updateItem: async (itemId, quantity) => {
    try {
      const res = await cartAPI.updateCartItem(itemId, { quantity });
      const cart = res.data.data;
      set({ cart, itemCount: cart.totalItems || 0 });
    } catch (err) { /* ignore */ }
  },

  removeItem: async (itemId) => {
    try {
      const res = await cartAPI.removeCartItem(itemId);
      const cart = res.data.data;
      set({ cart, itemCount: cart.totalItems || 0 });
    } catch (err) { /* ignore */ }
  },

  saveForLater: async (itemId) => {
    try {
      const res = await cartAPI.saveForLater(itemId);
      const cart = res.data.data;
      set({ cart, itemCount: cart.totalItems || 0 });
    } catch (err) { /* ignore */ }
  },

  moveToCart: async (itemId) => {
    try {
      const res = await cartAPI.moveToCart(itemId);
      const cart = res.data.data;
      set({ cart, itemCount: cart.totalItems || 0 });
    } catch (err) { /* ignore */ }
  },

  clearCart: async () => {
    try {
      await cartAPI.clearCart();
      set({ cart: null, itemCount: 0 });
    } catch (err) { /* ignore */ }
  },
}));

export default useCartStore;
