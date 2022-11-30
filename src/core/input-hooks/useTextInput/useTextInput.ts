import { FocusEvent, useCallback, useMemo } from 'react';

import { useField } from '@core/Form';

import { UseTextInput, UseTextInputReturnType } from './types';

export const useTextInput: (args: UseTextInput) => UseTextInputReturnType = ({
  dependencyExtractor,
  formatter,
  initialValue,
  name,
  onBlurSideEffect,
  sideEffect,
  validationDebounceTime,
  validator
}) => {
  const builtInitialValue = useMemo(() => {
    if (typeof initialValue === 'function') {
      return initialValue({});
    } else {
      return initialValue;
    }
  }, [initialValue]);

  const props = useField<string>({
    dependencyExtractor,
    formatter,
    initialValue: onBlurSideEffect
      ? onBlurSideEffect({ value: builtInitialValue ?? '' })
      : initialValue ?? '',
    name,
    sideEffect,
    validationDebounceTime,
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
