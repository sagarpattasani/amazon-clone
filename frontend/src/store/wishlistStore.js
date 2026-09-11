import { create } from 'zustand';
import { wishlistAPI } from '../services/api';

const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const res = await wishlistAPI.getWishlist();
      set({ items: res.data.data || [], loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  addItem: async (productId) => {
    try {
      await wishlistAPI.addToWishlist(productId);
      // Re-fetch to get full product data
      get().fetchWishlist();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to wishlist' };
    }
  },

  removeItem: async (productId) => {
    // Optimistic removal
    set((state) => ({ items: state.items.filter((i) => i.id !== productId) }));
    try {
      await wishlistAPI.removeFromWishlist(productId);
      return { success: true };
    } catch (err) {
      // Re-fetch on error
      get().fetchWishlist();
      return { success: false, message: err.response?.data?.message || 'Failed to remove' };
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  clearError: () => set({ error: null }),
}));

export default useWishlistStore;
