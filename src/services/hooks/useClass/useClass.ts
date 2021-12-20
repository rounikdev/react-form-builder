import { DependencyList, useMemo } from 'react';

export const useClass = (
  classes: (string | boolean | undefined)[],
  dependencyList: DependencyList = []
): string => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo<string>(() => classes.filter(Boolean).join(' '), dependencyList);
};
