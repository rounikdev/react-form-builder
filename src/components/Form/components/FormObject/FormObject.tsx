import { FC, memo, useMemo } from 'react';

import { FormContextInstance } from '../../context';
import { useFormInteraction, useFormParent, useFormReducer, useFormReset } from '../../hooks';
import { formObjectReducer } from '../../reducers';
import { flattenFormObjectState } from '../../services';
import { FormContext, FormObjectProps } from '../../types';

export const FormObject: FC<FormObjectProps> = memo(({ children, name, onReset }) => {
  const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
    flattenState: flattenFormObjectState,
    reducer: formObjectReducer
  });

  const { forceValidate, forceValidateFlag, reset, resetFlag } = useFormInteraction({ onReset });

  const { getFieldId } = useFormParent({
    forceValidate,
    name,
    reset,
    valid,
    value
  });

  const { cancel, edit, isEdit, save } = useFormReset({ fieldId: getFieldId(), reset });

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
      isEdit,
      methods,
      resetFlag,
      valid
    };
  }, [context, forceValidateFlag, isEdit, methods, resetFlag, valid]);

  return (
    <FormContextInstance.Provider value={formContext}>{children}</FormContextInstance.Provider>
  );
});

FormObject.displayName = 'FormObject';
