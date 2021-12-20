import { MutableRefObject, useEffect, useRef } from 'react';

export const useUpdatedRef = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};
