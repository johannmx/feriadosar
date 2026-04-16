import { renderHook, waitFor } from '@testing-library/react';
import { useHolidays } from './useHolidays';
import * as holidayService from '../services/holidayService';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../services/holidayService');

describe('useHolidays', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fetch holidays and update state on success', async () => {
    const mockHolidays = [{ fecha: '2024-01-01', tipo: 'inamovible', nombre: 'Año Nuevo' }];
    vi.mocked(holidayService.fetchHolidays).mockResolvedValue(mockHolidays);

    const { result } = renderHook(() => useHolidays(2024));

    expect(result.current.loading).toBe(true);
    expect(result.current.apiStatus).toBe('checking');

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.holidays).toEqual(mockHolidays);
    expect(result.current.apiStatus).toBe('up');
  });

  it('should handle API failure', async () => {
    vi.mocked(holidayService.fetchHolidays).mockRejectedValue(new Error('API Down'));

    const { result } = renderHook(() => useHolidays(2024));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.holidays).toEqual([]);
    expect(result.current.apiStatus).toBe('down');
  });

  it('should handle timeout/abort', async () => {
    const abortError = new Error('The user aborted a request.');
    abortError.name = 'AbortError';
    vi.mocked(holidayService.fetchHolidays).mockRejectedValue(abortError);

    const { result } = renderHook(() => useHolidays(2024));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.apiStatus).toBe('down');
  });

  it('should abort previous request when year changes', async () => {
    let signal: AbortSignal | undefined;
    vi.mocked(holidayService.fetchHolidays).mockImplementation(async (_year, s) => {
      signal = s;
      return new Promise(() => {}); // never resolves
    });

    const { rerender } = renderHook(({ year }) => useHolidays(year), {
      initialProps: { year: 2024 }
    });

    const firstSignal = signal;
    expect(firstSignal?.aborted).toBe(false);

    rerender({ year: 2025 });

    expect(firstSignal?.aborted).toBe(true);
  });
});
