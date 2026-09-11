import { describe, it, expect, beforeEach } from 'vitest';

describe('themeStore', () => {
  let useThemeStore;

  beforeEach(async () => {
    localStorage.clear();
    const module = await import('../store/themeStore.js');
    useThemeStore = module.default;
    useThemeStore.setState({ theme: 'light' });
  });

  it('should default to light theme', () => {
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('should toggle to dark theme', () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should toggle back to light', () => {
    useThemeStore.getState().toggleTheme(); // dark
    useThemeStore.getState().toggleTheme(); // light
    expect(useThemeStore.getState().theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
