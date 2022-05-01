import { FC, memo, useMemo } from 'react';

import { FormContextInstance } from '../../context';
import { useFormInteraction, useFormParent, useFormReducer, useFormReset } from '../../hooks';
import { FormEditProvider, useFormEditContext } from '../../providers';
import { formObjectReducer } from '../../reducers';
import { flattenFormObjectState } from '../../services';
import { FormContext, FormObjectProps } from '../../types';

export const FormObject: FC<FormObjectProps> = memo(({ children, name, onReset }) => {
  const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
    flattenState: flattenFormObjectState,
    reducer: formObjectReducer
  });

  const { forceValidate, forceValidateFlag, reset, resetFlag } = useFormInteraction({ onReset });

  const { isEdit: isParentEdit } = useFormEditContext();

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
      isEdit: isEdit || isParentEdit,
      methods,
      resetFlag,
      valid
    };
  }, [context, forceValidateFlag, isEdit, isParentEdit, methods, resetFlag, valid]);

  return (
    <FormEditProvider isEdit={isEdit || isParentEdit}>
      <FormContextInstance.Provider value={formContext}>{children}</FormContextInstance.Provider>
    </FormEditProvider>
  );
});

FormObject.displayName = 'FormObject';
