import { FC, memo, useMemo } from 'react';

import { FormContextInstance } from '../../context';
import { useFormInteraction, useFormParent, useFormReducer } from '../../hooks';
import { formObjectReducer } from '../../reducers';
import { flattenFormObjectState } from '../../services';
import { FormContext, FormObjectProps } from '../../types';

export const FormObject: FC<FormObjectProps> = memo(({ children, name, onReset }) => {
  const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
    flattenState: flattenFormObjectState,
    reducer: formObjectReducer,
    type: 'object'
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

  return (
    <FormContextInstance.Provider value={formContext}>{children}</FormContextInstance.Provider>
  );
});

FormObject.displayName = 'FormObject';
