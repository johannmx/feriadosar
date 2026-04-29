import type { Holiday } from '../types/holiday';

const MAX_HOLIDAYS = 100;

export const fetchHolidays = async (year: number, signal?: AbortSignal): Promise<Holiday[]> => {
  // Security Enhancement: Validate network request parameter to prevent path traversal/SSRF
  if (!Number.isSafeInteger(year) || year < 2000 || year > 2100) {
    throw new Error('Invalid year parameter');
  }

  const res = await fetch(`https://api.argentinadatos.com/v1/feriados/${year}`, {
    signal,
    credentials: 'omit',
    redirect: 'error',
    referrerPolicy: 'no-referrer', // Security Enhancement: Prevent leaking application URL
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

  // Security Enhancement: Validate Content-Length to prevent Client-Side DoS via massive payload memory exhaustion
  const contentLengthStr = res.headers.get('content-length');
  if (contentLengthStr) {
    const contentLength = parseInt(contentLengthStr, 10);
    // 50KB is more than enough for a year's worth of JSON holiday data. Fail securely if length is NaN.
    if (Number.isNaN(contentLength) || contentLength > 50000) {
      throw new Error('API response too large (Content-Length exceeds limits or is invalid)');
    }
  }

  const data = await res.json();

  // Security Enhancement: Validate external API input
  if (!Array.isArray(data)) {
    throw new Error('Invalid API response format');
  }

  // Enforce maximum length to prevent DoS via excessive DOM rendering
  if (data.length > MAX_HOLIDAYS) {
    throw new Error('API response too large');
  }

  // Type validate each item to ensure no malicious injection
  // Prevent application crash (DoS) from invalid dates, limit string lengths, and block HTML injection
  const validatedHolidays = data.filter((h: unknown) => {
    if (!h || typeof h !== 'object') return false;
    const item = h as Record<string, unknown>;

    const isValidDate = typeof item.fecha === 'string' &&
                        /^\d{4}-\d{2}-\d{2}$/.test(item.fecha) &&
                        !isNaN(new Date(item.fecha + 'T00:00:00').getTime());

    const isValidTipo = typeof item.tipo === 'string' &&
                        item.tipo.length <= 50 &&
                        !/[<>]/.test(item.tipo);

    const isValidNombre = typeof item.nombre === 'string' &&
                          item.nombre.length <= 255 &&
                          !/[<>]/.test(item.nombre);

    return isValidDate && isValidTipo && isValidNombre;
  }) as Holiday[];

  return validatedHolidays;
};
