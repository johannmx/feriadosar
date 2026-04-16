import { useEffect, useState, useRef } from 'react';
import { Holiday } from '../types/holiday';
import { fetchHolidays } from '../services/holidayService';

export type ApiStatus = 'checking' | 'up' | 'down';

export function useHolidays(year: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout>;

    const getHolidays = async () => {
      setLoading(true);
      timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const validatedHolidays = await fetchHolidays(year, controller.signal);
        if (isMounted.current) {
          setHolidays(validatedHolidays);
          setApiStatus('up');
        }
      } catch (error) {
        if (isMounted.current) {
          setApiStatus('down');
          console.error('Error fetching holidays. External API might be down or timed out.');
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    getHolidays();

    return () => {
      isMounted.current = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [year]);

  return { holidays, loading, apiStatus };
}
