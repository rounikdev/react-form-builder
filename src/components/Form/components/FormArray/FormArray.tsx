import { memo, PropsWithChildren, useMemo } from 'react';

import { FormContextInstance } from '../../context';
import { useFormArray, useFormReducer, useNestedForm } from '../../hooks';
import { FormEditProvider } from '../../providers';
import { formArrayReducer } from '../../reducers';
import { flattenFormArrayState } from '../../services';
import { FormContext, FormArrayProps } from '../../types';

const BaseFormArray = <T,>({
  children,
  factory,
  initialValue,
  localEdit = false,
  name,
  onReset
}: PropsWithChildren<FormArrayProps<T>>) => {
  const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
    flattenState: flattenFormArrayState,
    reducer: formArrayReducer
  });

  const {
    cancel,
    edit,
    isEdit,
    isParentEdit,
    forceValidate,
    forceValidateFlag,
    getFieldId,
    reset,
    save
  } = useNestedForm({
    name,
    onReset,
    valid,
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
      setInForm
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cancel, edit, getFieldId, reset, save]
  );

  const formContext = useMemo<FormContext>(() => {
    return {
      ...context,
      forceValidateFlag,
      isEdit: localEdit ? isEdit : isEdit || isParentEdit,
      isParentEdit,
      localEdit,
      methods,
      valid
    };
  }, [context, forceValidateFlag, isEdit, isParentEdit, localEdit, methods, valid]);

  const { add, list, remove } = useFormArray<T>({
    factory,
    fieldId: getFieldId(),
    initialValue
  });

  return (
    <FormEditProvider isEdit={formContext.isEdit}>
      <FormContextInstance.Provider value={formContext}>
        {children([list, add, remove])}
      </FormContextInstance.Provider>
    </FormEditProvider>
  );
};

type FormArrayType = typeof BaseFormArray & { displayName: string };

export const FormArray = memo(BaseFormArray) as FormArrayType;

FormArray.displayName = 'FormArray';
