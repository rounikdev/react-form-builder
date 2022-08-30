import { memo, useMemo } from 'react';

import { FormContextInstance } from '@core/Form/context';
import { useFormArray, useFormReducer, useNestedForm } from '@core/Form/hooks';
import { FormEditProvider } from '@core/Form/providers';
import { formArrayReducer } from '@core/Form/reducers';
import { flattenFormArrayState } from '@core/Form/services';
import { FormArrayProps, FormContext } from '@core/Form/types';

const BaseFormArray = <T,>({
  children,
  dependencyExtractor,
  factory,
  initialValue,
  localEdit = false,
  name,
  validator
}: FormArrayProps<T>) => {
  const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
    flattenState: flattenFormArrayState,
    reducer: formArrayReducer
  });

  const {
    cancel,
    edit,
    errors,
    forceValidate,
    forceValidateFlag,
    getFieldId,
    isEdit,
    isParentEdit,
    nestedIsValid,
    reset,
    save,
    touched,
    touchParent
  } = useNestedForm<T>({
    dependencyExtractor,
    name,
    valid,
    validator,
    value
  });

  const methods = useMemo(
    () => ({
      cancel,
      edit,
      forceValidate,
      getFieldId,
      removeFromForm,
      reset,
      save,
      setInForm,
      touchParent
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cancel, edit, getFieldId, reset, save]
  );

  const formContext = useMemo<FormContext>(() => {
    return {
      ...context,
      forceValidateFlag,
      formOnlyErrors: errors,
      isEdit: localEdit ? isEdit : isEdit || isParentEdit,
      isParentEdit,
      localEdit,
      methods,
      touched,
      valid: valid && nestedIsValid
    };
  }, [
    context,
    errors,
    forceValidateFlag,
    isEdit,
    isParentEdit,
    localEdit,
    methods,
    nestedIsValid,
    touched,
    valid
  ]);

  const { add, list, remove } = useFormArray<T>({
    factory,
    fieldId: getFieldId(),
    initialValue
  });

  return (
    <FormEditProvider isEdit={formContext.isEdit}>
      <FormContextInstance.Provider value={formContext}>
        {children([list, add, remove, errors, touched])}
      </FormContextInstance.Provider>
    </FormEditProvider>
  );
};

type FormArrayType = typeof BaseFormArray & { displayName: string };

export const FormArray = memo(BaseFormArray) as FormArrayType;

FormArray.displayName = 'FormArray';
