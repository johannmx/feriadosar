import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  let matchMediaSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Clear localStorage and document state
    window.localStorage.clear();
    document.documentElement.className = '';

    // Remove injected meta tags
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.remove();
    }

    // Mock matchMedia
    matchMediaSpy = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = matchMediaSpy as unknown as (query: string) => MediaQueryList;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with system theme by default', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
    // Since matches is false (light mode preferred)
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should initialize with theme from localStorage if available', () => {
    window.localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should fallback to system theme if localStorage has invalid value', () => {
    window.localStorage.setItem('theme', 'invalid-theme');
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
  });

  it('should update theme and document class on setTheme', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(window.localStorage.getItem('theme')).toBe('dark');
  });

  it('should evaluate system preference properly when system theme is active', () => {
    matchMediaSpy.mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.theme).toBe('system');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should set appropriate meta theme-color', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    expect(metaThemeColor?.getAttribute('content')).toBe('#0f172a');

    act(() => {
      result.current.setTheme('light');
    });

    metaThemeColor = document.querySelector('meta[name="theme-color"]');
    expect(metaThemeColor?.getAttribute('content')).toBe('#f8fafc');
  });
});
