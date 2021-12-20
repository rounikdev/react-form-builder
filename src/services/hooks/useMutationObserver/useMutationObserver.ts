import { useEffect, useRef } from 'react';
import { UseMutationObserverConfig } from '../types';

export const useMutationObserver = ({
  callback,
  config,
  target
}: UseMutationObserverConfig): void => {
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (target.current) {
      observerRef.current = new MutationObserver(callback);
      observerRef.current.observe(target.current, config);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, config, target.current]);
};
