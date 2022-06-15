import { FC, memo, useMemo } from 'react';

import { FormContextInstance } from '../../context';
import { useFormReducer, useNestedForm } from '../../hooks';
import { FormEditProvider } from '../../providers';
import { formObjectReducer } from '../../reducers';
import { flattenFormObjectState } from '../../services';
import { FormContext, FormObjectProps } from '../../types';

export const FormObject: FC<FormObjectProps> = memo(({ children, localEdit = false, name }) => {
  const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
    flattenState: flattenFormObjectState,
    reducer: formObjectReducer
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

  return (
    <FormEditProvider isEdit={formContext.isEdit}>
      <FormContextInstance.Provider value={formContext}>{children}</FormContextInstance.Provider>
    </FormEditProvider>
  );
});

FormObject.displayName = 'FormObject';
