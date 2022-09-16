import { SetStateAction, useCallback, useMemo, useState } from 'react';

import {
  useBeforeFirstRender,
  useIsMounted,
  useUpdate,
  useUpdatedRef
} from '@rounik/react-custom-hooks';

import { useFormRoot } from '@core/Form/providers';
import {
  DependencyExtractor,
  FormStateEntryValue,
  UseFieldConfig,
  UseFieldState,
  ValidityCheck
} from '@core/Form/types';
import { GlobalModel } from '@services';

interface UseFieldStateConfig<T>
  extends Pick<UseFieldConfig<T>, 'dependencyExtractor' | 'formatter' | 'initialValue'> {
  fieldId: string;
}

/**
 * We set that the formatter
 * should only be dependent
 * on the dependency value.
 * So it will be called only
 * when the dependency value
 * gets updated.
 */
export const useFieldState = <T>({
  dependencyExtractor,
  fieldId,
  formatter,
  initialValue
}: UseFieldStateConfig<T>) => {
  const {
    fieldsToBeSet,
    formData,
    methods: { setDirty, setFieldsValue }
  } = useFormRoot();

  const dependency = useMemo(() => {
    if (typeof dependencyExtractor === 'function' && !!formData) {
      return dependencyExtractor(formData);
    } else {
      return undefined;
    }
  }, [dependencyExtractor, formData]);

  const updatedDependency = useMemo(
    () => dependency,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [GlobalModel.createStableDependency(dependency)]
  );

  const updatedDependencyRef = useUpdatedRef(updatedDependency);

  const formatterRef = useUpdatedRef(formatter);

  const builtInitialValue = useMemo(() => {
    let value: FormStateEntryValue;

    if (typeof initialValue === 'function') {
      // TODO: Think of a way to ensure that this function returns type T
      value = (initialValue as DependencyExtractor)(updatedDependency);
    } else {
      value = initialValue;
    }
    return value;
  }, [updatedDependency, initialValue]);

  const updatedInitialValue = useMemo(
    () => builtInitialValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [GlobalModel.createStableDependency(builtInitialValue)]
  );

  let initialStateValue = updatedInitialValue;

  useBeforeFirstRender(() => {
    if (formatter) {
      initialStateValue = formatter({
        dependencyValue: updatedDependency,
        newValue: updatedInitialValue
      });
    } else {
      initialStateValue = updatedInitialValue;
    }
  });

  const [state, setFieldState] = useState<UseFieldState<T>>({
    errors: [],
    focused: false,
    touched: false,
    valid: true,
    validating: false,
    value: initialStateValue
  });

  const isMounted = useIsMounted();

  const setState = useCallback(
    (value: SetStateAction<UseFieldState<T>>) => {
      if (isMounted.current) {
        setFieldState(value);
      }
    },
    [isMounted]
  );

  const blur = useCallback(() => {
    setState((current) => ({ ...current, focused: false, touched: true, validating: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focus = useCallback(() => {
    setState((current) => ({ ...current, focused: true, touched: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTouch = useCallback((touched: boolean) => {
    setState((current) => ({ ...current, touched }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValidity = useCallback(
    ({ errors, valid }: ValidityCheck) => {
      setState((current) => ({ ...current, errors, valid, validating: false }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const setValue = useCallback(
    ({ value }: { useDependency?: boolean; value: T }) => {
      setState((current) => {
        const formattedValue = formatterRef.current
          ? formatterRef.current({
              dependencyValue: updatedDependencyRef.current,
              newValue: value,
              oldValue: current.value
            })
          : value;

        return { ...current, valid: false, validating: true, value: formattedValue };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const resetState = useCallback((value: T) => {
    setState((current) => ({
      ...current,
      focused: false,
      touched: false,
      valid: false,
      validating: true,
      value
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUpdate(() => {
    setValue({ value: state.value });
  }, [updatedDependency]);

  useUpdate(() => {
    setValue({ value: updatedInitialValue });
  }, [updatedInitialValue]);

  // Set value from the
  // root method call:
  useUpdate(() => {
    if (fieldsToBeSet[fieldId] !== undefined) {
      setDirty();

      setValue({ value: fieldsToBeSet[fieldId] });

      setFieldsValue({ [fieldId]: undefined });
    }
  }, [fieldsToBeSet]);

  return {
    blur,
    focus,
    resetState,
    setTouch,
    setValidity,
    setValue,
    state,
    updatedDependency,
    updatedInitialValue
  };
};
