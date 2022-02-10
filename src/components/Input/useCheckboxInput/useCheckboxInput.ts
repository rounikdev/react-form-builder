import { useField } from '@components/Form';
import { UseFieldReturnType } from '@components/Form/types';

import { UseCheckboxInput } from './types';

export const useCheckboxInput: (args: UseCheckboxInput) => UseFieldReturnType<boolean> = ({
  dependencyExtractor,
  initialValue,
  name,
  sideEffect,
  validator
}) => {
  return useField<boolean>({
    dependencyExtractor,
    initialValue: !!initialValue,
    name,
    sideEffect,
    validator
  });
};
