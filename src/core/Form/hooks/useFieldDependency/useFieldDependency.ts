import { useMemo } from 'react';

import { useUpdate } from '@rounik/react-custom-hooks';

import {
  FormStateEntryValue,
  UseFieldDependencyConfig,
  UseFieldDependencyReturnType
} from '../../types';

export const useFieldDependency = <T>({
  dependencyValue,
  disabled,
  initialValue,
  label,
  onChangeHandler
}: UseFieldDependencyConfig<T>): UseFieldDependencyReturnType => {
  const builtInitialValue = useMemo(
    () =>
      typeof initialValue === 'function'
        ? (initialValue as (dependencyValue: FormStateEntryValue) => T)(dependencyValue)
        : initialValue,
    [dependencyValue, initialValue]
  );

  const builtDisabled = useMemo(
    () => !!(typeof disabled === 'function' ? disabled(dependencyValue) : disabled),
    [dependencyValue, disabled]
  );

  const builtLabel = useMemo(
    () => (typeof label === 'function' ? label(dependencyValue) : label || ''),
    [dependencyValue, label]
  );

  useUpdate(() => {
    if (onChangeHandler && typeof builtInitialValue !== 'undefined') {
      onChangeHandler(builtInitialValue);
    }
  }, [builtInitialValue, onChangeHandler]);

  return { disabled: builtDisabled, label: builtLabel };
};
