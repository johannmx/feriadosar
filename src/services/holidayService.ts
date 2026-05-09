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

  // Security Enhancement: Use stream reader with a hard 50KB limit to prevent Client-Side DoS
  // via memory exhaustion, even if Content-Length is missing or spoofed.
  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('ReadableStream not supported or missing');
  }

  let receivedLength = 0;
  const chunks: Uint8Array[] = [];
  const MAX_BYTES = 50000;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    if (value) {
      receivedLength += value.length;
      if (receivedLength > MAX_BYTES) {
        reader.cancel();
        throw new Error('API response too large (Stream exceeded max bytes limit)');
      }
      chunks.push(value);
    }
  }

  const chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }

  // Security Enhancement: Fail securely on invalid UTF-8 instead of silently substituting characters
  const textDecoder = new TextDecoder('utf-8', { fatal: true });
  const responseText = textDecoder.decode(chunksAll);
  const data = JSON.parse(responseText);

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
  }).map((item) => ({
    // Security Enhancement: Explicitly map only expected properties to prevent
    // prototype pollution or carrying over unexpected/malicious data from API.
    fecha: (item as Holiday).fecha,
    tipo: (item as Holiday).tipo,
    nombre: (item as Holiday).nombre
  })) as Holiday[];

  return validatedHolidays;
};
