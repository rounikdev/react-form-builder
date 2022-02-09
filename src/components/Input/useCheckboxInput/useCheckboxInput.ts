import { useField } from '@components/Form';

import { UseCheckboxInput, UseCheckboxInputReturn } from './types';

export const useCheckboxInput: (args: UseCheckboxInput) => UseCheckboxInputReturn = ({
  dependencyExtractor,
  disabled,
  initialValue,
  name,
  sideEffect,
  validator
}) => {
  const props = useField<boolean>({
    dependencyExtractor,
    initialValue: !!initialValue,
    name,
    sideEffect,
    validator
  });

  return { ...props, disabled };
};
