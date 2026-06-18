import type { Holiday } from '../types/holiday';

const MAX_HOLIDAYS = 100;

// In-memory cache to store holiday fetch promises by year to prevent redundant/duplicate requests
const holidayCache = new Map<number, Promise<Holiday[]>>();

export const fetchHolidays = (year: number, signal?: AbortSignal): Promise<Holiday[]> => {
  // Security Enhancement: Validate network request parameter to prevent path traversal/SSRF
  if (!Number.isSafeInteger(year) || year < 2000 || year > 2100) {
    throw new Error('Invalid year parameter');
  }

  // Return the cached promise if it exists to reuse the result or active request
  const cachedPromise = holidayCache.get(year);
  if (cachedPromise) {
    return cachedPromise;
  }

  const promise = (async () => {
    const res = await fetch(`https://api.argentinadatos.com/v1/feriados/${year}`, {
      signal,
      credentials: 'omit',
      redirect: 'error',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) throw new Error('API down');

    // Security Enhancement: Validate Content-Type to prevent MIME confusion
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid Content-Type from external API');
    }

    let data;
    try {
      const rawText = await res.text();
      // Use reviver to prevent prototype pollution during deserialization
      data = JSON.parse(rawText, (key, value) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return undefined; // Drop dangerous keys
        }
        return value;
      });
    } catch {
      throw new Error('Failed to securely parse API response');
    }

    // Security Enhancement: Validate external API input
    if (!Array.isArray(data)) {
      throw new Error('Invalid API response format');
    }

    // Enforce maximum length to prevent DoS via excessive DOM rendering
    if (data.length > MAX_HOLIDAYS) {
      throw new Error('API response too large');
    }

    // Explicitly map properties to avoid implicit typecasting and dropped properties bypass
    const validatedHolidays = data.reduce((acc: Holiday[], h: unknown) => {
      if (!h || typeof h !== 'object') return acc;
      const item = h as Record<string, unknown>;

      // Validate required types and constraints
      if (typeof item.fecha === 'string' &&
          item.fecha.length === 10 &&
          !isNaN(new Date(item.fecha + 'T00:00:00').getTime()) &&
          typeof item.tipo === 'string' &&
          item.tipo.length <= 50 &&
          typeof item.nombre === 'string' &&
          item.nombre.length <= 255) {

        // Map exclusively the expected properties
        acc.push({
          fecha: item.fecha,
          tipo: item.tipo,
          nombre: item.nombre
        });
      }
      return acc;
    }, []);

    return validatedHolidays;
  })();

  // Cache the promise
  holidayCache.set(year, promise);

  // If the promise fails, evict it from the cache to allow retries on subsequent requests
  promise.catch(() => {
    holidayCache.delete(year);
  });

  return promise;
};
