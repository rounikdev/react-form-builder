import { FC, memo, useMemo } from 'react';

import { FormContextInstance } from '../../context';
import { useFormArray, useFormInteraction, useFormParent, useFormReducer } from '../../hooks';
import { formArrayReducer } from '../../reducers';
import { flattenFormArrayState } from '../../services';
import { FormContext, FormArrayProps } from '../../types';

export const FormArray: FC<FormArrayProps> = memo(({ children, factory, name, onReset }) => {
  const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
    flattenState: flattenFormArrayState,
    reducer: formArrayReducer
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

  const { add, list, remove } = useFormArray({ factory, fieldId: getFieldId(), resetFlag });

  return (
    <FormContextInstance.Provider value={formContext}>
      {children([list, add, remove])}
    </FormContextInstance.Provider>
  );
});

FormArray.displayName = 'FormArray';
