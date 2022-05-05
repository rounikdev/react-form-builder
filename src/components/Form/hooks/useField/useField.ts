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
  GlobalModel,
  useIsMounted,
  useLastDiffValue,
  useUpdate,
  useUpdateOnly,
  useUpdatedRef,
  useMount,
  useUnmount
} from '@services';

import { useFormEditContext, useFormRoot } from '../../providers';
import {
  FormStateEntryValue,
  UseFieldConfig,
  UseFieldState,
  UseFieldReturnType,
  ValidityCheck
} from '../../types';

import { useForm } from '../useForm/useForm';

export const useField = <T>({
  dependencyExtractor,
  formatter,
  initialValue,
  name,
  onBlur,
  onFocus,
  sideEffect,
  validator
}: UseFieldConfig<T>): UseFieldReturnType<T> => {
  const context = useForm();

  const { isEdit } = useFormEditContext();

  const {
    fieldToBeSet,
    focusedField,
    formData,
    methods: { focusField, registerFieldErrors, scrollFieldIntoView, setDirty, setFieldValue },
    resetFlag: rootResetFlag,
    resetRecords,
    scrolledField
  } = useFormRoot();

  const isMounted = useIsMounted();

  const fieldRef = useRef<HTMLElement | null>(null);

  const isRenderedRef = useRef(false);

  let stateValue = initialValue;

  if (!isRenderedRef.current) {
    if (formatter) {
      stateValue = formatter({
        newValue: initialValue
      });
    } else {
      stateValue = initialValue;
    }

    isRenderedRef.current = true;
  }

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

  const valueRef = useUpdatedRef(state.value);

  const prevValue = useLastDiffValue(state.value);

  const prevValueRef = useUpdatedRef(prevValue);

  const formatterRef = useUpdatedRef(formatter);

  const validateField = useCallback(
    async (value: T, dependencyValue?: FormStateEntryValue, useCurrentValue?: boolean) => {
      let validityCheck: ValidityCheck;

      const formattedValue = formatterRef.current
        ? formatterRef.current({
            newValue: value,
            oldValue: useCurrentValue ? valueRef.current : prevValueRef.current
          })
        : value;

      setState((current) => ({
        ...current,
        valid: false,
        validating: true,
        value: formattedValue
      }));

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

      setState((current) => ({
        ...current,
        ...validityCheck,
        validating: false,
        value: formattedValue
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validator]
  );

  useUpdateOnly(() => {
    setState((current) => ({
      ...current,
      touched: true
    }));
  }, [context.forceValidateFlag]);

  const dependency = useMemo(() => {
    if (typeof dependencyExtractor === 'function' && formData) {
      return dependencyExtractor(formData);
    } else {
      return undefined;
    }
  }, [dependencyExtractor, formData]);

  const dependencyRef = useUpdatedRef(dependency);

  // Validate only when dependency
  // has changed. That's why we use
  // ref for the value:
  useEffect(() => {
    validateField(valueRef.current, dependency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof dependency === 'bigint' ? dependency : JSON.stringify(dependency)]);

  useUpdateOnly(async () => {
    const parentId = context.methods.getFieldId();
    const fieldId = parentId ? `${parentId}.${name}` : name;
    const fieldPath = fieldId.split('.');

    const resetValue = GlobalModel.getNestedValue(resetRecords[rootResetFlag.resetKey], fieldPath);

    await validateField(resetValue, dependency);

    setState((current) => ({
      ...current,
      focused: false,
      touched: false,
      validating: false,
      value: formatterRef.current
        ? formatterRef.current({ newValue: resetValue, oldValue: undefined })
        : resetValue
    }));
  }, [rootResetFlag]);

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
      const parentId = context.methods.getFieldId();
      const fieldId = parentId ? `${parentId}.${name}` : name;

      registerFieldErrors({ fieldErrors: state.errors, fieldId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.methods.getFieldId, name, state.errors]);

  // Remove from form errors state on unmount:
  useEffect(() => {
    return () => {
      if (registerFieldErrors) {
        const parentId = context.methods.getFieldId();
        const fieldId = parentId ? `${parentId}.${name}` : name;

        registerFieldErrors({ fieldErrors: [], fieldId });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.methods.getFieldId, name]);

  useMount(() => {
    validateField(initialValue, dependencyRef.current);
  });

  // Update parent Form state:
  useEffect(() => {
    context.methods.setInForm({
      key: name,
      valid: state.valid,
      value: formatterRef.current
        ? formatterRef.current({ newValue: state.value, oldValue: prevValueRef.current })
        : state.value
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, state.valid, state.value]);

  const sideEffectRef = useUpdatedRef(sideEffect);

  // Execute side effect:
  useEffect(() => {
    if (sideEffectRef.current) {
      sideEffectRef.current({ methods: context.methods, value: state.value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.value]);

  // Focus element from the root form:
  useUpdate(() => {
    const parentId = context.methods.getFieldId();
    const fieldId = parentId ? `${parentId}.${name}` : name;

    if (focusedField === fieldId && fieldRef.current) {
      fieldRef.current.focus();

      focusField('');
    }
  }, [focusedField]);

  // Scroll element into view from the root form:
  useUpdate(() => {
    const parentId = context.methods.getFieldId();
    const fieldId = parentId ? `${parentId}.${name}` : name;

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
    const parentId = context.methods.getFieldId();
    const fieldId = parentId ? `${parentId}.${name}` : name;

    if (fieldToBeSet.id === fieldId) {
      setDirty();
      validateField(fieldToBeSet.value, dependencyRef.current);

      setFieldValue({ id: '', value: undefined });
    }
  }, [fieldToBeSet]);

  const onBlurHandler = useCallback(
    (event: FocusEvent) => {
      setState((current) => ({ ...current, focused: false, touched: true }));

      if (typeof onBlur === 'function') {
        onBlur(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onBlur]
  );

  const onChangeHandler = useCallback(
    (val) => {
      setDirty();

      return validateField(val, dependency, true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typeof dependency === 'bigint' ? dependency : JSON.stringify(dependency), validateField]
  );

  const onFocusHandler = useCallback(
    (event: FocusEvent) => {
      setState((current) => ({ ...current, focused: true, touched: true }));

      if (typeof onFocus === 'function') {
        onFocus(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onFocus]
  );

  return {
    fieldRef,
    isEdit,
    onBlurHandler,
    onChangeHandler,
    onFocusHandler,
    ...state
  };
};
