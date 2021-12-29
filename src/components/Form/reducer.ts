import { FormActions, FormContext, FormRemoveAction, FormSetAction } from './types';

export const reducer = (
  context: FormContext,
  action: FormSetAction | FormRemoveAction
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

      // Shift `left` all the elements after
      // the removed one in a form array:
      if (action.payload.type === 'array') {
        const stateLength = Object.keys(state).length;
        const indexAfterRemovedOne = parseInt(action.payload.key, 10) + 1;

        for (let i = indexAfterRemovedOne; i <= stateLength; i++) {
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

    default:
      return context;
  }
};
