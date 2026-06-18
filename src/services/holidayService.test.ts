import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchHolidays } from './holidayService';

describe('holidayService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should cache results and avoid duplicate fetches for the same year', async () => {
    const mockHolidays = [
      { fecha: '2026-01-01', tipo: 'inamovible', nombre: 'Año Nuevo' }
    ];

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      text: async () => JSON.stringify(mockHolidays),
    } as Response);

    // First fetch: should call the API
    const result1 = await fetchHolidays(2026);
    expect(result1).toEqual(mockHolidays);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Second fetch: should return cached data and not call the API again
    const result2 = await fetchHolidays(2026);
    expect(result2).toEqual(mockHolidays);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
