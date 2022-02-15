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
