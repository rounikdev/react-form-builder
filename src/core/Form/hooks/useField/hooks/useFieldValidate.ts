import { useCallback } from 'react';

import { useUpdate, useUpdatedRef } from '@rounik/react-custom-hooks';

import {
  FormStateEntryValue,
  UseFieldConfig,
  ValidationError,
  ValidityCheck
} from '@core/Form/types';

interface UseFieldValidateConfig<T> {
  setValidity: ({ errors, valid }: ValidityCheck) => void;
  updatedDependency: FormStateEntryValue;
  validating: boolean;
  validator: UseFieldConfig<T>['validator'];
  value: T;
}

const DEFAULT_ERRORS: ValidationError[] = [];

const VALIDATING_ERRORS: ValidationError[] = [{ text: 'errorValidating' }];

export const useFieldValidate = <T>({
  setValidity,
  updatedDependency,
  validating,
  validator,
  value
}: UseFieldValidateConfig<T>) => {
  const validatorRef = useUpdatedRef(validator);

  const validateField = useCallback(
    async (valueToValidate: T, dependencyValue?: FormStateEntryValue) => {
      let validityCheck: ValidityCheck;

      if (validatorRef.current) {
        try {
          validityCheck = await validatorRef.current(valueToValidate, dependencyValue);
        } catch (error) {
          validityCheck = {
            errors: VALIDATING_ERRORS,
            valid: false
          };
        }
      } else {
        validityCheck = {
          errors: DEFAULT_ERRORS,
          valid: true
        };
      }

      setValidity(validityCheck);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useUpdate(() => {
    if (validating) {
      validateField(value, updatedDependency);
    }
  }, [updatedDependency, validating, value]);
};
