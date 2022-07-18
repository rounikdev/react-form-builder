import {
  FormContext,
  FormContextReducer,
  FormRemoveAction,
  FormSetAction,
  FormSetStateAction
} from '../types';

export enum FormActions {
  SET_IN_FORM = 'SET_IN_FORM',
  REMOVE_FROM_FORM = 'REMOVE_FROM_FORM',
  SET_FORM_STATE = 'SET_FORM_STATE'
}

export const formRemoveFromArrayActionReducer = (
  context: FormContext,
  action: FormRemoveAction
) => {
  const state = { ...context.state };

  if (state[action.payload.key] !== undefined) {
    delete state[action.payload.key];
  } else {
    // Resetting the state may lead to consecutive
    // removals of indexes that don't exist
    // (because the index normalization
    //  and the indexes coming in the following
    //  order 2... 3... 4... 5 etc.).
    // So if such index, remove the last element:
    delete state[Object.keys(state).length - 1];
  }

  const stateLength = Object.keys(state).length;

  for (let i = parseInt(action.payload.key, 10) + 1; i <= stateLength; i++) {
    if (state[i]) {
      state[i - 1] = state[i];
      delete state[i];
    }
  }

  return {
    ...context,
    state
  };
};

export const formRemoveFromObjectActionReducer = (
  context: FormContext,
  action: FormRemoveAction
) => {
  const state = { ...context.state };
  delete state[action.payload.key];

  return {
    ...context,
    state
  };
};

export const formSetActionReducer = (context: FormContext, action: FormSetAction) => {
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
};

export const formSetStateActionReducer = (context: FormContext, action: FormSetStateAction) => ({
  ...context,
  state: action.payload
});

export const formObjectReducer: FormContextReducer = (context, action) => {
  switch (action.type) {
    case FormActions.SET_IN_FORM:
      return formSetActionReducer(context, action);

    case FormActions.REMOVE_FROM_FORM:
      return formRemoveFromObjectActionReducer(context, action);

    case FormActions.SET_FORM_STATE:
      return formSetStateActionReducer(context, action);

    default:
      return context;
  }
};

export const formArrayReducer: FormContextReducer = (context, action) => {
  switch (action.type) {
    case FormActions.SET_IN_FORM:
      return formSetActionReducer(context, action);

    case FormActions.REMOVE_FROM_FORM:
      return formRemoveFromArrayActionReducer(context, action);

    case FormActions.SET_FORM_STATE:
      return formSetStateActionReducer(context, action);

    default:
      return context;
  }
};
