import { useCallback, useMemo, useReducer } from 'react';

import { initialFormContext } from '../../context';
import { FormActions } from '../../reducers';
import { buildInitialFormState } from '../../services';
import {
  FormContextReducer,
  FormRemovePayload,
  FormSetPayload,
  FormState,
  FormStateEntry
} from '../../types';

export const useFormReducer = ({
  flattenState,
  initialData,
  reducer
}: {
  flattenState: (state: FormState) => FormStateEntry;
  initialData?: FormStateEntry;
  reducer: FormContextReducer;
}) => {
  const state = useMemo(
    () => (initialData ? buildInitialFormState(initialData) : initialFormContext.state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [context, dispatch] = useReducer(reducer, {
    ...initialFormContext,
    state
  });

  const { value, valid } = useMemo(() => {
    return flattenState(context.state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.state]);

  const removeFromForm = useCallback((payload: FormRemovePayload) => {
    dispatch({
      payload,
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