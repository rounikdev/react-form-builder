import { DependencyList, useEffect, useRef } from 'react';

import { UpdateCallback } from '../types';

export const useUpdateOnly = (callback: UpdateCallback, dependencyList: DependencyList): void => {
  const mountRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;

      return;
    }

    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
};
