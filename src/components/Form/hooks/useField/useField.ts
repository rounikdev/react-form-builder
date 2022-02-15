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

import { useFormData } from '../../providers';
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

  const { formData, initialData } = useFormData();

  const isMounted = useIsMounted();

  const fieldRef = useRef<HTMLElement | null>(null);

  const getInitialValue = useCallback(
    ({ getFromFormData }: { getFromFormData?: boolean } = {}) => {
      const parentId = context.methods.getFieldId();
      const fieldId = parentId ? `${parentId}.${name}` : name;

      const valueFromRootForm = GlobalModel.getNestedValue(
        getFromFormData ? formData : initialData,
        fieldId.split('.')
      );

      return valueFromRootForm !== undefined ? valueFromRootForm : initialValue;
    },
    [context.methods, formData, initialData, initialValue, name]
  );

  const isRenderedRef = useRef(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let stateValue = null;

  if (!isRenderedRef.current) {
    if (formatter) {
      stateValue = formatter({
        newValue: getInitialValue({ getFromFormData: true })
      });
    } else {
      stateValue = getInitialValue({ getFromFormData: true });
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
    const initialVal = getInitialValue();

    await validateField(initialVal, dependency);

    setState((current) => ({
      ...current,
      focused: false,
      touched: false,
      validating: false,
      value: formatterRef.current
        ? formatterRef.current({ newValue: initialVal, oldValue: undefined })
        : initialVal
    }));
  }, [context.resetFlag]);

  useUnmount(() => {
    context.methods.removeFromForm({ key: name });
  });

  // Remove from form errors state on unmount:
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

  useMount(() => {
    validateField(getInitialValue({ getFromFormData: true }), dependencyRef.current);
  });

  // Update on initialValue change:
  useUpdateOnly(() => {
    validateField(initialValue, dependencyRef.current);
  }, [initialValue]);

  // Update parent Form state:
  useEffect(() => {
    // setInForm is a constant
    // amd there is no need to
    // include it in the dependency
    // array:
    context.methods.setInForm({
      key: name,
      valid: state.valid,
      value: formatterRef.current
        ? formatterRef.current({ newValue: state.value, oldValue: prevValueRef.current })
        : state.value
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, state.valid, state.value]);

  // Update form errors state on errors update:
  useEffect(() => {
    if (context.methods.registerFieldErrors) {
      const parentId = context.methods.getFieldId();
      const fieldId = parentId ? `${parentId}.${name}` : name;

      context.methods.registerFieldErrors({ fieldErrors: state.errors, fieldId });
    }
  }, [context.methods, name, state.errors]);

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

    if (context.focusedField === fieldId && fieldRef.current) {
      fieldRef.current.focus();

      context.methods.focusField('');
    }
  }, [context.focusedField]);

  // Scroll element into view from the root form:
  useUpdate(() => {
    const parentId = context.methods.getFieldId();
    const fieldId = parentId ? `${parentId}.${name}` : name;

    if (context.scrolledField === fieldId && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });

      context.methods.scrollFieldIntoView('');
    }
  }, [context.scrolledField]);

  // Set value from the root form:
  useUpdate(() => {
    const parentId = context.methods.getFieldId();
    const fieldId = parentId ? `${parentId}.${name}` : name;

    if (context.fieldToBeSet.id === fieldId) {
      validateField(context.fieldToBeSet.value, dependencyRef.current);

      context.methods.setFieldValue({ id: '', value: undefined });
    }
  }, [context.fieldToBeSet]);

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
    (val) => validateField(val, dependency, true),
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
    onBlurHandler,
    onChangeHandler,
    onFocusHandler,
    ...state
  };
};
