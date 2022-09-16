import { useEffect, useMemo } from 'react';

import { useForm } from '@core/Form/hooks/useForm/useForm';
import { useFormEditContext, useFormRoot } from '@core/Form/providers';
import { UseFieldConfig, UseFieldReturnType } from '@core/Form/types';

import {
  useFieldDOM,
  useFieldErrors,
  useFieldParent,
  useFieldReset,
  useFieldState,
  useFieldValidate
} from './hooks';

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
  const { methods: rootMethods } = useFormRoot();

  const { isEdit } = useFormEditContext();

  const { methods: parentMethods } = useForm();
  const { getFieldId } = parentMethods;

  const fieldId = useMemo(() => {
    const parentId = getFieldId();

    return parentId ? `${parentId}.${name}` : name;
  }, [getFieldId, name]);

  const {
    blur,
    focus,
    resetState,
    setTouch,
    setValidity,
    setValue,
    state,
    updatedDependency,
    updatedInitialValue
  } = useFieldState<T>({ dependencyExtractor, fieldId, formatter, initialValue });

  useFieldErrors({ fieldErrors: state.errors, fieldId });

  useFieldParent<T>({ fieldId, name, setTouch, valid: state.valid, value: state.value });

  const { fieldRef, onBlurHandler, onChangeHandler, onFocusHandler } = useFieldDOM<T>({
    blur,
    fieldId,
    focus,
    onBlur,
    onFocus,
    setValue,
    touched: state.touched
  });

  useFieldReset<T>({ fieldId, resetState, updatedInitialValue });

  useFieldValidate({
    setValidity,
    updatedDependency,
    validating: state.validating,
    validator,
    value: state.value
  });

  useEffect(() => {
    if (sideEffect) {
      sideEffect({
        dependencyValue: updatedDependency,
        methods: { form: parentMethods, root: rootMethods },
        value: state.value
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.value, updatedDependency]);

  return {
    dependencyValue: updatedDependency,
    fieldId,
    fieldRef,
    isEdit,
    onBlurHandler,
    onChangeHandler,
    onFocusHandler,
    ...state
  };
};
