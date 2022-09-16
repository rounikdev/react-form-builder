import { useEffect } from 'react';

import { useFormRoot } from '@core/Form/providers';
import { ValidationError } from '@core/Form/types';

interface UseFieldErrorsConfig {
  fieldErrors: ValidationError[];
  fieldId: string;
}

export const useFieldErrors = ({ fieldErrors, fieldId }: UseFieldErrorsConfig) => {
  const {
    methods: { registerFieldErrors }
  } = useFormRoot();

  // Update form errors state on errors update:
  useEffect(() => {
    if (registerFieldErrors) {
      registerFieldErrors({ fieldErrors, fieldId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId, fieldErrors]);

  // Remove from form the root
  // errors state on unmount:
  useEffect(() => {
    return () => {
      if (registerFieldErrors) {
        registerFieldErrors({ fieldErrors: [], fieldId });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId]);
};
