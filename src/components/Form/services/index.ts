import { FormState, FormStateEntry } from '../types';

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
    { valid: true as boolean, value: [] as unknown[] }
  );
};
