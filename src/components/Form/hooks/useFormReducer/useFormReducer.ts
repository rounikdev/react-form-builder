import { useCallback, useMemo, useReducer } from 'react';

import { initialFormContext } from '../../context';
import { FormActions } from '../../reducers';
import {
  FormContextReducer,
  FormRemovePayload,
  FormSetPayload,
  FormState,
  FormStateEntry
} from '../../types';

export const useFormReducer = ({
  flattenState,
  reducer
}: {
  flattenState: (state: FormState) => FormStateEntry;
  reducer: FormContextReducer;
}) => {
  const [context, dispatch] = useReducer(reducer, initialFormContext);

  const { value, valid } = useMemo(() => {
    return flattenState(context.state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.state]);

  const removeFromForm = useCallback((payload: FormRemovePayload) => {
    dispatch({
      payload,
      type: FormActions.REMOVE_FROM_FORM
    });
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
