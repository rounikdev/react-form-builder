import { FocusEvent, useCallback, useRef } from 'react';

import { useUpdate } from '@rounik/react-custom-hooks';

import { useForm } from '@core/Form/hooks/useForm/useForm';
import { useFormRoot } from '@core/Form/providers';
import { UseFieldConfig } from '@core/Form/types';

interface UseFieldDOMConfig<T> extends Pick<UseFieldConfig<T>, 'onBlur' | 'onFocus'> {
  blur: () => void;
  fieldId: string;
  focus: () => void;
  setValue: ({ value }: { value: T }) => void;
  touched: boolean;
}

export const useFieldDOM = <T>({
  blur,
  fieldId,
  focus,
  onBlur,
  onFocus,
  setValue,
  touched
}: UseFieldDOMConfig<T>) => {
  const {
    focusedField,
    methods: { setDirty },
    scrolledField
  } = useFormRoot();

  const {
    methods: { blurParent, focusParent, touchParent }
  } = useForm();

  const fieldRef = useRef<HTMLElement | null>(null);

  // Focus the element from
  // root method call:
  useUpdate(() => {
    if (focusedField === fieldId && fieldRef.current) {
      fieldRef.current.focus();
    }
  }, [focusedField]);

  // Scroll the element into view
  // from root method call:
  useUpdate(() => {
    if (scrolledField === fieldId && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, [scrolledField]);

  useUpdate(() => {
    if (touched) {
      touchParent();
    }
  }, [touched]);

  const onBlurHandler = useCallback(
    (event: FocusEvent) => {
      blur();

      if (typeof onBlur === 'function') {
        onBlur(event);
      }

      blurParent();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onBlur]
  );

  const onChangeHandler = useCallback(
    (value: T) => {
      setDirty();

      setValue({ value });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onFocusHandler = useCallback(
    (event: FocusEvent) => {
      focus();

      if (typeof onFocus === 'function') {
        onFocus(event);
      }

      focusParent();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onFocus]
  );

  return {
    fieldRef,
    onBlurHandler,
    onChangeHandler,
    onFocusHandler
  };
};
