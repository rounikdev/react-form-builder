import { INITIAL_RESET_RECORD_KEY, ROOT_RESET_RECORD_KEY } from '../constants';
import { FormState, FormStateEntry, ResetFlag } from '../types';

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
        valid: obj.valid && current.valid,
        value: [...obj.value, current.value]
      };
    },
    { valid: true as boolean, value: [] as unknown[] }
  );
};

export const shouldBeReset = ({
  fieldId,
  resetFlag
}: {
  fieldId: string;
  resetFlag: ResetFlag;
}) => {
  return (
    (resetFlag.resetKey && fieldId.indexOf(resetFlag.resetKey) === 0) ||
    resetFlag.resetKey === ROOT_RESET_RECORD_KEY ||
    resetFlag.resetKey === INITIAL_RESET_RECORD_KEY ||
    resetFlag.resetList?.includes(fieldId)
  );
};
