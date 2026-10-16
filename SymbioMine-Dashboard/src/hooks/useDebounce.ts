/**
 * SYMBIOMINE Debounce Hook
 * Smooths high-frequency keystroke input to prevent layout thrashing and repeated filter cycles.
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
