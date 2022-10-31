import { useRef } from 'react';

export const useUpdateSync = <T>(callback: () => void, value: T) => {
  const refDiff = useRef(value);

  if (refDiff.current !== value) {
    callback();

    refDiff.current = value;
  }
};
