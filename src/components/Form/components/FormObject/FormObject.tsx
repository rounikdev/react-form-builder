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

  const { getFieldId } = useFormParent({
    forceValidate,
    name,
    reset,
    valid,
    value
  });

  const methods = useMemo(
    () => ({
      forceValidate,
      getFieldId,
      removeFromForm,
      reset,
      setInForm
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getFieldId, reset]
  );

  const formContext = useMemo<FormContext>(() => {
    return {
      ...context,
      forceValidateFlag,
      methods,
      resetFlag,
      valid
    };
  }, [context, forceValidateFlag, methods, resetFlag, valid]);

  return (
    <FormContextInstance.Provider value={formContext}>{children}</FormContextInstance.Provider>
  );
});

FormObject.displayName = 'FormObject';
