import { useEffect, useState } from 'react';

/**
 * Read values from the live stylesheet. In dev, re-reads after every hot
 * update so editing a token in index.css refreshes the printed values too.
 * `read` must be a stable (module-level) function.
 */
export function useLiveTokens<T>(read: () => T): T {
  const [value, setValue] = useState(read);

  useEffect(() => {
    const hot = import.meta.hot;
    if (!hot) return;
    const update = () => setValue(read());
    hot.on('vite:afterUpdate', update);
    return () => hot.off('vite:afterUpdate', update);
  }, [read]);

  return value;
}
