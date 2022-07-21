import { useField } from '@core/Form';

import { UseCheckboxInput, UseCheckboxReturnType } from './types';

export const useCheckboxInput: (args: UseCheckboxInput) => UseCheckboxReturnType = ({
  dependencyExtractor,
  initialValue,
  name,
  required,
  sideEffect,
  validator
}) => {
  return useField<boolean>({
    dependencyExtractor,
    initialValue: !!initialValue,
    name,
    required,
    sideEffect,
    validator
  });
};
