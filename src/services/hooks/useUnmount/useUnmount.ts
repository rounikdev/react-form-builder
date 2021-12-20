import { useEffect } from 'react';

import { CleanupCallback } from '../types';
import { useUpdatedRef } from '../useUpdatedRef/useUpdatedRef';

export const useUnmount = (cleanupCallback: CleanupCallback): void => {
  const updatedCleanupCallback = useUpdatedRef(cleanupCallback);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updatedCleanupCallback.current, []);
};
