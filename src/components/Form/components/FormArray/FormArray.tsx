import { FC, memo, useMemo } from 'react';

import { FormContextInstance } from '../../context';
import { useFormArray, useFormInteraction, useFormParent, useFormReducer } from '../../hooks';
import { formArrayReducer } from '../../reducers';
import { flattenFormArrayState } from '../../services';
import { FormContext, FormArrayProps } from '../../types';

export const FormArray: FC<FormArrayProps> = memo(({ children, factory, name, onReset }) => {
  const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
    flattenState: flattenFormArrayState,
    reducer: formArrayReducer,
    type: 'array'
  });

  const { forceValidate, forceValidateFlag, reset, resetFlag } = useFormInteraction({ onReset });

  const { getFieldId, parentContext } = useFormParent({
    forceValidate,
    name,
    reset,
    valid,
    value
  });

  const methods = useMemo(
    () => ({
      focusField: parentContext.methods.focusField,
      forceValidate,
      getFieldId,
      registerFieldErrors: parentContext.methods.registerFieldErrors,
      removeFromForm,
      reset,
      scrollFieldIntoView: parentContext.methods.scrollFieldIntoView,
      setFieldValue: parentContext.methods.setFieldValue,
      setInForm
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getFieldId, reset]
  );

  const formContext = useMemo<FormContext>(() => {
    return {
      ...context,
      fieldToBeSet: parentContext.fieldToBeSet,
      focusedField: parentContext.focusedField,
      forceValidateFlag,
      methods,
      resetFlag,
      scrolledField: parentContext.scrolledField,
      valid
    };
  }, [
    context,
    forceValidateFlag,
    methods,
    parentContext.fieldToBeSet,
    parentContext.focusedField,
    parentContext.scrolledField,
    resetFlag,
    valid
  ]);

  const { add, list, remove } = useFormArray({ factory, fieldId: getFieldId(), resetFlag });

  return (
    <FormContextInstance.Provider value={formContext}>
      {children([list, add, remove])}
    </FormContextInstance.Provider>
  );
});

FormArray.displayName = 'FormArray';
