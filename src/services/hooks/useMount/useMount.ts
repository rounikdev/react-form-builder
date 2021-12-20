import { useEffect } from 'react';

import { MountCallback } from '../types';

export const useMount = (callback: MountCallback): void => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
