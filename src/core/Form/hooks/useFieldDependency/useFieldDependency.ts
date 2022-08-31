import { useMemo } from 'react';

import { UseFieldDependencyConfig, UseFieldDependencyReturnType } from '../../types';

export const useFieldDependency = <T>({
  dependencyValue,
  disabled,
  label
}: UseFieldDependencyConfig<T>): UseFieldDependencyReturnType => {
  const builtDisabled = useMemo(
    () => !!(typeof disabled === 'function' ? disabled(dependencyValue) : disabled),
    [dependencyValue, disabled]
  );

  const builtLabel = useMemo(
    () => (typeof label === 'function' ? label(dependencyValue) : label || ''),
    [dependencyValue, label]
  );

  return { disabled: builtDisabled, label: builtLabel };
};
