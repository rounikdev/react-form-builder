import { useRef } from 'react';

export const useLastDiffValue = <T>(
  value: T,
  comparator?: ({ prevValue, newValue }: { prevValue: T; newValue: T }) => boolean
): T | undefined => {
  const valueList = useRef<T[]>([]);

  valueList.current.unshift(value);

  return valueList.current.find((listValue) => {
    return comparator ? comparator({ prevValue: listValue, newValue: value }) : listValue !== value;
  });
};
