import { FocusEvent, useCallback, useEffect, useMemo, useState } from 'react';

import {
  useIsMounted,
  useMount,
  usePrevious,
  useUnmount,
  useUpdate,
  useUpdateOnly,
  useUpdatedRef
} from '@services';

import { useForm } from './Form';
import { useFormData } from './FormDataProvider';

import {
  FormStateEntryValue,
  UseFieldConfig,
  UseFieldState,
  UseFieldReturnType,
  ValidityCheck
} from './types';

export function useField<T>({
  dependencyExtractor,
  formatter,
  initialValue,
  name,
  onBlur,
  onFocus,
  sideEffect,
  validator
}: UseFieldConfig<T>): UseFieldReturnType<T> {
  const context = useForm();

  const { formData } = useFormData();

  const isMounted = useIsMounted();

  const [state, setState] = useState<UseFieldState<T>>({
    errors: [],
    focused: false,
    touched: false,
    valid: true,
    validating: false,
    value: formatter ? formatter({ newValue: initialValue }) : initialValue
  });

  const prevValue = usePrevious(state.value);

  const formatterRef = useUpdatedRef(formatter);

  const validateField = useCallback(
    async (value: T, dependencyValue?: FormStateEntryValue) => {
      let validityCheck: ValidityCheck;

      const formattedValue = formatterRef.current
        ? formatterRef.current({ newValue: value, oldValue: prevValue })
        : value;

      if (isMounted.current) {
        setState((currentState) => ({
          ...currentState,
          valid: false,
          validating: true,
          value: formattedValue
        }));
      }

      if (validator) {
        try {
          validityCheck = await validator(formattedValue, dependencyValue);
        } catch (error) {
          validityCheck = {
            errors: [{ text: 'errorValidating' }],
            valid: false
          };
        }
      } else {
        validityCheck = {
          errors: [],
          valid: true
        };
      }

      if (isMounted.current) {
        setState((currentState) => ({
          ...currentState,
          ...validityCheck,
          validating: false
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validator]
  );

  // Touch on force validate:
  useUpdateOnly(() => {
    if (isMounted.current) {
      setState((currentState) => ({
        ...currentState,
        touched: true
      }));
    }
  }, [context.forceValidateFlag]);

  const dependency = useMemo(() => {
    if (dependencyExtractor && formData) {
      return dependencyExtractor(formData);
    } else {
      return undefined;
    }
  }, [dependencyExtractor, formData]);

  const dependencyRef = useUpdatedRef(dependency);

  useMount(() => {
    validateField(initialValue, dependency);
  });

  // Update on initialValue change:
  useUpdateOnly(() => {
    validateField(initialValue, dependencyRef.current);
  }, [initialValue]);

  const valueRef = useUpdatedRef(state.value);

  // Validate on dependency change:
  useUpdate(() => {
    validateField(valueRef.current, dependency);
  }, [dependency]);

  // Reset on resetFlag change:
  useUpdateOnly(async () => {
    await validateField(initialValue, dependency);

    if (isMounted.current) {
      setState((currentState) => ({
        ...currentState,
        focused: false,
        touched: false
      }));
    }
  }, [context.resetFlag]);

  // Remove from form errors' state:
  useEffect(() => {
    return () => {
      if (context.methods.registerFieldErrors) {
        const parentId = context.methods.getFieldId();
        const fieldId = parentId ? `${parentId}.${name}` : name;

        context.methods.registerFieldErrors({ fieldErrors: [], fieldId });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.methods.getFieldId]);

  // Update parent form state:
  useUpdate(() => {
    // setInForm is a constant
    // and there is no need to
    // include it into the
    // dependency array:
    context.methods.setInForm({
      key: name,
      valid: state.valid,
      value: formatterRef.current
        ? formatterRef.current({ newValue: state.value, oldValue: prevValue })
        : state.value
    });
  }, [name, state.valid, state.value]);

  // Update form errors' state
  // on errors change:
  useUpdate(() => {
    return () => {
      if (context.methods.registerFieldErrors) {
        const parentId = context.methods.getFieldId();
        const fieldId = parentId ? `${parentId}.${name}` : name;

        context.methods.registerFieldErrors({ fieldErrors: state.errors, fieldId });
      }
    };
  }, [context.methods, name, state.errors]);

  const sideEffectRef = useUpdatedRef(sideEffect);

  // Execute side effect on value change:
  useUpdate(() => {
    if (sideEffectRef.current) {
      sideEffectRef.current({ value: state.value });
    }
  }, [state.value]);

  useUnmount(() => {
    context.methods.removeFromForm({ key: name });
  });

  const onBlurHandler = useCallback(
    (event: FocusEvent) => {
      if (isMounted.current) {
        setState((currentState) => ({
          ...currentState,
          focused: false,
          touched: true
        }));
      }

      if (onBlur) {
        onBlur(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onBlur]
  );

  const onChangeHandler = useCallback(
    (val) => validateField(val, dependency),
    [dependency, validateField]
  );

  const onFocusHandler = useCallback(
    (event: FocusEvent) => {
      if (isMounted.current) {
        setState((currentState) => ({
          ...currentState,
          focused: true,
          touched: true
        }));
      }

      if (onFocus) {
        onFocus(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onBlur]
  );

  return {
    onBlurHandler,
    onChangeHandler,
    onFocusHandler,
    ...state
  };
}
