import {
  FocusEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  useBeforeFirstRender,
  useIsMounted,
  useLastDiffValue,
  useUnmount,
  useUpdate,
  useUpdatedRef,
  useUpdateOnly
} from '@rounik/react-custom-hooks';

import { ROOT_RESET_RECORD_KEY } from '@core/Form/constants';
import { useForm } from '@core/Form/hooks/useForm/useForm';
import { useFormEditContext, useFormRoot } from '@core/Form/providers';
import { shouldBeReset } from '@core/Form/services';
import {
  FormStateEntryValue,
  UseFieldConfig,
  UseFieldReturnType,
  UseFieldState,
  ValidityCheck
} from '@core/Form/types';
import { GlobalModel } from '@services';

export const useField = <T>({
  dependencyExtractor,
  formatter,
  initialValue,
  name,
  onBlur,
  onFocus,
  required,
  sideEffect,
  validator
}: UseFieldConfig<T>): UseFieldReturnType<T> => {
  const context = useForm();

  const { isEdit } = useFormEditContext();

  const {
    fieldsToBeSet,
    focusedField,
    formData,
    methods: { focusField, registerFieldErrors, scrollFieldIntoView, setDirty, setFieldsValue },
    resetFlag,
    resetRecords,
    scrolledField
  } = useFormRoot();

  const isMounted = useIsMounted();

  const fieldRef = useRef<HTMLElement | null>(null);

  const dependency = useMemo(() => {
    if (typeof dependencyExtractor === 'function' && formData) {
      return dependencyExtractor(formData);
    } else {
      return undefined;
    }
  }, [dependencyExtractor, formData]);

  const updatedDependency = useMemo(
    () => dependency,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typeof dependency === 'bigint' ? dependency : JSON.stringify(dependency)]
  );

  const updatedInitialValue = useMemo(() => {
    if (typeof initialValue === 'function') {
      return (initialValue as (dependencyValue: FormStateEntryValue) => T)(updatedDependency);
    } else {
      return initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    updatedDependency,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...(typeof initialValue !== 'function'
      ? [typeof initialValue === 'bigint' ? initialValue : JSON.stringify(initialValue)]
      : [])
  ]);

  let stateValue = updatedInitialValue;

  useBeforeFirstRender(() => {
    if (formatter) {
      stateValue = formatter({
        dependencyValue: updatedDependency,
        newValue: updatedInitialValue
      });
    } else {
      stateValue = updatedInitialValue;
    }
  });

  const [state, setFieldState] = useState<UseFieldState<T>>({
    errors: [],
    focused: false,
    touched: false,
    valid: true,
    validating: false,
    value: stateValue
  });

  const setState = useCallback(
    (value: SetStateAction<UseFieldState<T>>) => {
      if (isMounted.current) {
        setFieldState(value);
      }
    },
    [isMounted]
  );

  const prevValue = useLastDiffValue(state.value);

  const prevValueRef = useUpdatedRef(prevValue);

  const valueRef = useUpdatedRef(state.value);

  const formatterRef = useUpdatedRef(formatter);

  const validatorRef = useUpdatedRef(validator);

  const isRequired = useMemo(() => {
    if (typeof required === 'undefined') {
      return false;
    }

    if (typeof required === 'boolean') {
      return required;
    }

    return required(updatedDependency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedDependency]);

  const validateField = useCallback(
    async (value: T, dependencyValue?: FormStateEntryValue, useDependency?: boolean) => {
      let validityCheck: ValidityCheck;
      let formattedValue: T;

      if (value !== valueRef.current || useDependency) {
        let oldValue: T | undefined;

        if (value !== valueRef.current) {
          oldValue = valueRef.current;
        } else if (useDependency) {
          oldValue = prevValueRef.current;
        }

        formattedValue = formatterRef.current
          ? formatterRef.current({
              dependencyValue,
              newValue: value,
              oldValue
            })
          : value;
      } else {
        formattedValue = value;
      }

      setState((current) => ({
        ...current,
        valid: false,
        validating: true,
        value: formattedValue
      }));

      if (validatorRef.current) {
        try {
          validityCheck = await validatorRef.current(formattedValue, dependencyValue);
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

      setState((current) => ({
        ...current,
        ...validityCheck,
        validating: false,
        value: formattedValue
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fieldId = useMemo(() => {
    const parentId = context.methods.getFieldId();

    return parentId ? `${parentId}.${name}` : name;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.methods.getFieldId, name]);

  useUpdateOnly(() => {
    if (Object.keys(context.forceValidateFlag).length === 0) {
      setState((current) => ({
        ...current,
        touched: true
      }));
    } else if (typeof context.forceValidateFlag[fieldId] === 'boolean') {
      setState((current) => ({
        ...current,
        touched: context.forceValidateFlag[fieldId]
      }));
    }
  }, [context.forceValidateFlag]);

  // Validate only when updatedDependency
  // has changed. That's why we use
  // ref for the value:
  useEffect(() => {
    validateField(state.value, updatedDependency, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedDependency]);

  useUpdateOnly(async () => {
    const fieldPath = fieldId.split('.');

    if (shouldBeReset({ fieldId, resetFlag })) {
      const resetValue =
        GlobalModel.getNestedValue(
          resetRecords[resetFlag.resetKey || ROOT_RESET_RECORD_KEY],
          fieldPath
        ) ?? initialValue;

      await validateField(resetValue, updatedDependency);

      setState((current) => ({
        ...current,
        focused: false,
        touched: false,
        validating: false
      }));
    }
  }, [resetFlag]);

  useUnmount(() => {
    // No need to call setDirty, because a field could be
    // unmounted because removal form array, which calls
    // setDirty or from conditional field change, which
    // might have happened because some form state update
    // which calls setDirty:
    context.methods.removeFromForm({ key: name });
  });

  // Update form errors state on errors update:
  useEffect(() => {
    if (registerFieldErrors) {
      registerFieldErrors({ fieldErrors: state.errors, fieldId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId, state.errors]);

  // Remove from form errors state on unmount:
  useEffect(() => {
    return () => {
      if (registerFieldErrors) {
        registerFieldErrors({ fieldErrors: [], fieldId });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId]);

  useUpdate(() => {
    validateField(updatedInitialValue, updatedDependency);
  }, [updatedInitialValue]);

  // Update parent Form state:
  useEffect(() => {
    context.methods.setInForm({
      key: name,
      valid: state.valid,
      value: state.value
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, state.valid, state.value]);

  // Execute side effect:
  useEffect(() => {
    if (sideEffect) {
      sideEffect({
        dependencyValue: updatedDependency,
        methods: context.methods,
        value: state.value
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.value, updatedDependency]);

  // Focus element from the root form:
  useUpdate(() => {
    if (focusedField === fieldId && fieldRef.current) {
      fieldRef.current.focus();

      focusField('');
    }
  }, [focusedField]);

  // Scroll element into view from the root form:
  useUpdate(() => {
    if (scrolledField === fieldId && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });

      scrollFieldIntoView('');
    }
  }, [scrolledField]);

  // Set value from the root form:
  useUpdate(() => {
    if (fieldsToBeSet[fieldId] !== undefined) {
      setDirty();
      validateField(fieldsToBeSet[fieldId], updatedDependency);
      setFieldsValue({ [fieldId]: undefined });
    }
  }, [fieldsToBeSet]);

  useUpdate(() => {
    if (state.touched) {
      context.methods.touchParent();
    }
  }, [state.touched]);

  const onBlurHandler = useCallback(
    (event: FocusEvent) => {
      setState((current) => ({ ...current, focused: false, touched: true }));

      if (typeof onBlur === 'function') {
        onBlur(event);
      }

      context.methods.blurParent();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onBlur]
  );

  const onChangeHandler = useCallback(
    (val) => {
      setDirty();

      return validateField(val, updatedDependency);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updatedDependency, validateField]
  );

  const onFocusHandler = useCallback(
    (event: FocusEvent) => {
      setState((current) => ({ ...current, focused: true, touched: true }));

      if (typeof onFocus === 'function') {
        onFocus(event);
      }

      context.methods.focusParent();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onFocus]
  );

  return {
    dependencyValue: updatedDependency,
    fieldId,
    fieldRef,
    isEdit,
    isRequired,
    onBlurHandler,
    onChangeHandler,
    onFocusHandler,
    ...state
  };
};
