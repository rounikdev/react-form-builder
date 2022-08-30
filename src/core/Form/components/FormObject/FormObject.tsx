import { FC, memo, useMemo } from 'react';

import { FormContextInstance } from '@core/Form/context';
import { useFormReducer, useNestedForm } from '@core/Form/hooks';
import { FormEditProvider } from '@core/Form/providers';
import { formObjectReducer } from '@core/Form/reducers';
import { flattenFormObjectState } from '@core/Form/services';
import { FormContext, FormObjectProps } from '@core/Form/types';

export const FormObject: FC<FormObjectProps> = memo(
  ({ children, dependencyExtractor, localEdit = false, name, validator }) => {
    const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
      flattenState: flattenFormObjectState,
      reducer: formObjectReducer
    });

    const {
      cancel,
      edit,
      forceValidate,
      forceValidateFlag,
      getFieldId,
      isEdit,
      isParentEdit,
      nestedIsValid,
      reset,
      save,
      touchParent
    } = useNestedForm({
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
        isEdit: localEdit ? isEdit : isEdit || isParentEdit,
        isParentEdit,
        localEdit,
        methods,
        valid: valid && nestedIsValid
      };
    }, [
      context,
      forceValidateFlag,
      isEdit,
      isParentEdit,
      localEdit,
      methods,
      nestedIsValid,
      valid
    ]);

    return (
      <FormEditProvider isEdit={formContext.isEdit}>
        <FormContextInstance.Provider value={formContext}>{children}</FormContextInstance.Provider>
      </FormEditProvider>
    );
  }
);

FormObject.displayName = 'FormObject';
