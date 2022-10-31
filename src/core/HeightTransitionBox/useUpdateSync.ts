import { DependencyList, useEffect, useRef } from 'react';

export const useUpdateSync = <T>(callback: () => void, value: T) => {
  const refDiff = useRef(value);

  if (refDiff.current !== value) {
    callback();

    refDiff.current = value;
  }
};

export const useUpdateOnly = (callback: () => void, dependencyList: DependencyList): void => {
  const mountRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
};
