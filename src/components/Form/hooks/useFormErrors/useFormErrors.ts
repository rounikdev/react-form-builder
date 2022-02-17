import { useCallback, useState } from 'react';

import { FieldErrors, FieldErrorsPayload } from '../../types';

export const useFormErrors = () => {
  const [errors, setErrors] = useState<FieldErrors>({});

  const registerFieldErrors = useCallback(({ fieldErrors, fieldId }: FieldErrorsPayload) => {
    setErrors((currentErrors) => {
      if (fieldErrors.length === 0) {
        const newErrors = { ...currentErrors };

        delete newErrors[fieldId];
        return newErrors;
      }
      return {
        ...currentErrors,
        [fieldId]: fieldErrors
      };
    });
  }, []);

  return {
    errors,
    registerFieldErrors
  };
};
