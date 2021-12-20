import { useEffect, useRef } from 'react';

import { UseResizeObserverConfig } from '../types';

export const useResizeObserver = ({ callback, target }: UseResizeObserverConfig): void => {
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (target.current) {
      observerRef.current = new ResizeObserver(callback);
      observerRef.current.observe(target.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, target.current]);
};
