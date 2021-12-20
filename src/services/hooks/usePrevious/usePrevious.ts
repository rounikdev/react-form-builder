import { useRef } from 'react';

import { useUpdateOnly } from '../useUpdateOnly/useUpdateOnly';

export const usePrevious = <T>(value: T): T => {
  const ref = useRef(value);
  const refOld = useRef(ref.current);

  useUpdateOnly(() => {
    refOld.current = ref.current;
    ref.current = value;
  }, [value]);

  return refOld.current;
};
