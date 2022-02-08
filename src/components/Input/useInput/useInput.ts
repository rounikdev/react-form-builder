import { FocusEvent, useCallback } from 'react';

import { useField } from '@components/Form';

import { UseInput, UseInputReturnType } from './types';

export const useInput: (args: UseInput) => UseInputReturnType = ({
  dependencyExtractor,
  disabled,
  formatter,
  initialValue,
  name,
  onBlurSideEffect,
  sideEffect,
  validator
}) => {
  const props = useField<string>({
    dependencyExtractor,
    formatter,
    initialValue: initialValue ?? '',
    name,
    sideEffect,
    validator
  });

  const onBlurHandler = useCallback(
    (event: FocusEvent<HTMLElement, Element>) => {
      props.onBlurHandler(event);
      onBlurSideEffect && onBlurSideEffect({ value: props.value, setValue: props.onChangeHandler });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onBlurSideEffect, props.onBlurHandler, props.onChangeHandler, props.value]
  );

  return { ...props, disabled, onBlurHandler };
};
