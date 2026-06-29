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
      body: {
        getReader: () => {
          let done = false;
          return {
            read: async () => {
              if (done) return { done: true, value: undefined };
              done = true;
              return {
                done: false,
                value: new TextEncoder().encode(JSON.stringify(mockHolidays))
              };
            },
            cancel: async () => {}
          };
        }
      } as unknown as ReadableStream<Uint8Array>
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

  it('should throw an error if the API response exceeds the maximum byte limit', async () => {
    const mockResponseChunk = new Uint8Array(60000); // 60KB (exceeds 50KB limit)

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      body: {
        getReader: () => {
          let done = false;
          return {
            read: async () => {
              if (done) return { done: true, value: undefined };
              done = true;
              return { done: false, value: mockResponseChunk };
            },
            cancel: async () => {}
          };
        }
      } as unknown as ReadableStream<Uint8Array>
    } as Response);

    await expect(fetchHolidays(2027)).rejects.toThrow('API response too large');
  });

  it('should filter out holidays with malformed date or HTML tags', async () => {
    const mockHolidays = [
      { fecha: '2026-01-01', tipo: 'inamovible', nombre: 'Año Nuevo' }, // valid
      { fecha: '2026/01/02', tipo: 'inamovible', nombre: 'Fecha Invalida' }, // invalid date format
      { fecha: '2026-01-03', tipo: '<script>alert(1)</script>', nombre: 'Tipo con Script' }, // HTML tag in tipo
      { fecha: '2026-01-04', tipo: 'inamovible', nombre: 'Nombre con <b>negrita</b>' }, // HTML tag in nombre
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      body: {
        getReader: () => {
          let done = false;
          return {
            read: async () => {
              if (done) return { done: true, value: undefined };
              done = true;
              return {
                done: false,
                value: new TextEncoder().encode(JSON.stringify(mockHolidays))
              };
            },
            cancel: async () => {}
          };
        }
      } as unknown as ReadableStream<Uint8Array>
    } as Response);

    const result = await fetchHolidays(2028);
    expect(result).toEqual([
      { fecha: '2026-01-01', tipo: 'inamovible', nombre: 'Año Nuevo' }
    ]);
  });
});
