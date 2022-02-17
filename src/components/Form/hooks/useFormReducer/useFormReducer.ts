import { useCallback, useMemo, useReducer } from 'react';

import { initialFormContext } from '../../context';
import { FormActions } from '../../reducers';
import { buildInitialFormState } from '../../services';
import {
  FormContextReducer,
  FormRemoveArguments,
  FormSetPayload,
  FormState,
  FormStateEntry,
  FormType
} from '../../types';

export const useFormReducer = ({
  flattenState,
  initialData,
  reducer,
  type
}: {
  flattenState: (state: FormState) => FormStateEntry;
  initialData?: FormStateEntry;
  reducer: FormContextReducer;
  type: FormType;
}) => {
  const [context, dispatch] = useReducer(reducer, {
    ...initialFormContext,
    state: initialData ? buildInitialFormState(initialData) : initialFormContext.state
  });

  const { value, valid } = useMemo(() => {
    return flattenState(context.state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.state]);

  const removeFromForm = useCallback((payload: FormRemoveArguments) => {
    dispatch({
      payload: {
        ...payload,
        type
      },
      type: FormActions.REMOVE_FROM_FORM
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setInForm = useCallback((payload: FormSetPayload) => {
    dispatch({
      payload,
      type: FormActions.SET_IN_FORM
    });
  }, []);

  return {
    context,
    dispatch,
    removeFromForm,
    setInForm,
    valid,
    value
  };
};
