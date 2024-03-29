import { useField } from '@core/Form';

import { UseCheckboxInput, UseCheckboxReturnType } from './types';

export const useCheckboxInput: (args: UseCheckboxInput) => UseCheckboxReturnType = ({
  dependencyExtractor,
  initialValue,
  name,
  sideEffect,
  validator
}) => {
  return useField<boolean>({
    dependencyExtractor,
    initialValue,
    name,
    sideEffect,
    validator
  });
};
