import { DependencyList, useEffect } from 'react';

import { UpdateCallback } from '../types';

export const useUpdate = (callback: UpdateCallback, dependencyList: DependencyList): void => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
};
