import { FormState, FormStateEntry, FormStateEntryValue } from '../types';

export const buildInitialFormState = (initialData: FormStateEntryValue): FormState => {
  return initialData
    ? Object.entries(initialData).reduce((currentInitialState, [key, value]) => {
        return {
          ...currentInitialState,
          [key]: {
            valid: false,
            value
          }
        };
      }, {})
    : {};
};

export const flattenFormState = (obj: FormStateEntry, [k, v]: [string, FormStateEntry]) => {
  return {
    valid: obj.valid && v.valid,
    value: { ...obj.value, [k]: v.value }
  };
};

export const flattenFormObjectState = (state: FormState): FormStateEntry => {
  return Object.entries(state).reduce(flattenFormState, {
    valid: true,
    value: {}
  });
};

export const flattenFormArrayState = (state: FormState): FormStateEntry => {
  return Object.entries(state).reduce(
    (obj, [, current]) => {
      return {
        value: [...obj.value, current.value],
        valid: obj.valid && current.valid
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { valid: true as boolean, value: [] as any[] }
  );
};
