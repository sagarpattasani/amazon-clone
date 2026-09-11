import { create } from 'zustand';

const useComparisonStore = create((set, get) => ({
  items: [],
  maxItems: 4,

  addItem: (product) => {
    const { items, maxItems } = get();
    if (items.find((i) => i.id === product.id)) return;
    if (items.length >= maxItems) return;
    set({ items: [...items, product] });
  },

  removeItem: (productId) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== productId) }));
  },

  isInComparison: (productId) => {
    return get().items.some((i) => i.id === productId);
  },

  clearAll: () => set({ items: [] }),
}));

export default useComparisonStore;
