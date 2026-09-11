import { describe, it, expect, beforeEach } from 'vitest';

// Test the comparison store
describe('comparisonStore', () => {
  let useComparisonStore;

  beforeEach(async () => {
    const module = await import('../store/comparisonStore.js');
    useComparisonStore = module.default;
    useComparisonStore.getState().clearAll();
  });

  it('should start with empty items', () => {
    const { items } = useComparisonStore.getState();
    expect(items).toEqual([]);
  });

  it('should add item to comparison', () => {
    useComparisonStore.getState().addItem({ id: 1, title: 'Product 1' });
    expect(useComparisonStore.getState().items.length).toBe(1);
    expect(useComparisonStore.getState().items[0].id).toBe(1);
  });

  it('should not add duplicate items', () => {
    useComparisonStore.getState().addItem({ id: 1, title: 'Product 1' });
    useComparisonStore.getState().addItem({ id: 1, title: 'Product 1' });
    expect(useComparisonStore.getState().items.length).toBe(1);
  });

  it('should not exceed max 4 items', () => {
    for (let i = 1; i <= 5; i++) {
      useComparisonStore.getState().addItem({ id: i, title: `Product ${i}` });
    }
    expect(useComparisonStore.getState().items.length).toBe(4);
  });

  it('should remove item by id', () => {
    useComparisonStore.getState().addItem({ id: 1, title: 'Product 1' });
    useComparisonStore.getState().addItem({ id: 2, title: 'Product 2' });
    useComparisonStore.getState().removeItem(1);
    expect(useComparisonStore.getState().items.length).toBe(1);
    expect(useComparisonStore.getState().items[0].id).toBe(2);
  });

  it('should check if item is in comparison', () => {
    useComparisonStore.getState().addItem({ id: 1, title: 'Product 1' });
    expect(useComparisonStore.getState().isInComparison(1)).toBe(true);
    expect(useComparisonStore.getState().isInComparison(2)).toBe(false);
  });

  it('should clear all items', () => {
    useComparisonStore.getState().addItem({ id: 1, title: 'Product 1' });
    useComparisonStore.getState().addItem({ id: 2, title: 'Product 2' });
    useComparisonStore.getState().clearAll();
    expect(useComparisonStore.getState().items).toEqual([]);
  });
});
