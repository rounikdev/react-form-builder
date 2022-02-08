import { FormContext, FormRemoveAction, FormSetStateAction, FormSetAction } from './types';

export enum FormActions {
  SET_IN_FORM = 'SET_IN_FORM',
  REMOVE_FROM_FORM = 'REMOVE_FROM_FORM',
  SET_FORM_STATE = 'SET_FORM_STATE'
}

export const reducer = (
  context: FormContext,
  action: FormSetAction | FormRemoveAction | FormSetStateAction
): FormContext => {
  switch (action.type) {
    case FormActions.SET_IN_FORM:
      const targetState = context.state[action.payload.key];

      const targetValue = targetState?.value || undefined;
      const targetValidity = targetState?.valid || undefined;

      if (targetValue !== action.payload.value || targetValidity !== action.payload.valid) {
        return {
          ...context,
          state: {
            ...context.state,
            [action.payload.key]: { valid: action.payload.valid, value: action.payload.value }
          }
        };
      } else {
        return context;
      }
    case FormActions.REMOVE_FROM_FORM:
      const state = { ...context.state };
      delete state[action.payload.key];

      if (action.payload.type === 'array') {
        const stateLength = Object.keys(state).length;
        for (let i = parseInt(action.payload.key, 10) + 1; i <= stateLength; i++) {
          if (state[i]) {
            state[i - 1] = state[i];
            delete state[i];
          }
        }
      }

      return {
        ...context,
        state
      };

    case FormActions.SET_FORM_STATE:
      return { ...context, state: action.payload };

    default:
      return context;
  }
};
