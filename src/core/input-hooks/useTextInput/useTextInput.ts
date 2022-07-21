import { FocusEvent, useCallback } from 'react';

import { useField } from '@core/Form';

import { UseTextInput, UseTextInputReturnType } from './types';

export const useTextInput: (args: UseTextInput) => UseTextInputReturnType = ({
  dependencyExtractor,
  formatter,
  initialValue,
  name,
  onBlurSideEffect,
  required,
  sideEffect,
  validator
}) => {
  const props = useField<string>({
    dependencyExtractor,
    formatter,
    initialValue: onBlurSideEffect
      ? onBlurSideEffect({ value: initialValue ?? '' })
      : initialValue ?? '',
    name,
    required,
    sideEffect,
    validator
  });

  const onBlurHandler = useCallback(
    (event: FocusEvent<HTMLElement, Element>) => {
      props.onBlurHandler(event);

      if (onBlurSideEffect) {
        onBlurSideEffect({ setValue: props.onChangeHandler, value: props.value });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onBlurSideEffect, props.onBlurHandler, props.onChangeHandler, props.value]
  );

  return { ...props, onBlurHandler };
};
