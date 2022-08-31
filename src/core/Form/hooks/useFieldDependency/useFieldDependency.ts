import { useMemo } from 'react';

import { UseFieldDependencyConfig, UseFieldDependencyReturnType } from '../../types';

export const useFieldDependency = ({
  dependencyValue,
  disabled,
  label,
  required
}: UseFieldDependencyConfig): UseFieldDependencyReturnType => {
  const builtDisabled = useMemo(
    () => !!(typeof disabled === 'function' ? disabled(dependencyValue) : disabled),
    [dependencyValue, disabled]
  );

  const builtLabel = useMemo(
    () => (typeof label === 'function' ? label(dependencyValue) : label || ''),
    [dependencyValue, label]
  );

  const builtRequired = useMemo(
    () => !!(typeof required === 'function' ? required(dependencyValue) : required),
    [dependencyValue, required]
  );

  return { disabled: builtDisabled, label: builtLabel, required: builtRequired };
};
