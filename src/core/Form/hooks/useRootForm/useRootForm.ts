import { useCallback, useState } from 'react';

import { useUpdate, useUpdatedRef } from '@rounik/react-custom-hooks';

import { INITIAL_RESET_RECORD_KEY, ROOT_RESET_RECORD_KEY } from '@core/Form/constants';
import {
  FieldErrors,
  FieldErrorsPayload,
  ForceValidateFlag,
  FormStateEntryValue,
  ResetFlag,
  SetFieldValuePayload
} from '@core/Form/types';

interface UseRootFormProps {
  formData: FormStateEntryValue;
}

export const useRootForm = ({ formData }: UseRootFormProps) => {
  const [fieldToBeSet, setFieldValue] = useState<SetFieldValuePayload>({
    id: '',
    value: undefined
  });

  const [errors, setErrors] = useState<FieldErrors>({});

  const [pristine, setPristine] = useState<boolean>(true);

  const [focusedField, focusField] = useState('');

  const [scrolledField, scrollFieldIntoView] = useState('');

  const [forceValidateFlag, setForceValidateFlag] = useState<ForceValidateFlag>({});

  const [resetFlag, setResetFlag] = useState<ResetFlag>({
    resetKey: INITIAL_RESET_RECORD_KEY
  });

  const [resetRecords, setResetRecords] = useState<Record<string, FormStateEntryValue>>({});

  const forceValidate = useCallback(() => {
    setForceValidateFlag({});
  }, []);

  const [isEdit, setIsEdit] = useState(false);

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

  const setDirty = useCallback(() => setPristine(false), []);

  const cancel = useCallback(() => {
    setIsEdit(false);

    setResetFlag({ resetKey: ROOT_RESET_RECORD_KEY });

    setTimeout(() => {
      setResetRecords((currentResetRecords) => {
        const newResetRecords = { ...currentResetRecords };

        delete newResetRecords[ROOT_RESET_RECORD_KEY];

        return newResetRecords;
      });
    });
  }, []);

  const formDataRef = useUpdatedRef(formData);

  const edit = useCallback(() => {
    setIsEdit(true);

    setResetRecords((currentResetRecords) => {
      return {
        ...currentResetRecords,
        [ROOT_RESET_RECORD_KEY]: formDataRef.current
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setResetRecords]); // formData makes Form test hang

  const save = useCallback(() => {
    setIsEdit(false);

    setResetRecords((currentResetRecords) => {
      const newResetRecords = { ...currentResetRecords };

      delete newResetRecords[ROOT_RESET_RECORD_KEY];

      return newResetRecords;
    });
  }, []);

  const getFieldId = useCallback(() => '', []);

  const reset = useCallback(() => {
    setResetFlag({ resetKey: INITIAL_RESET_RECORD_KEY });

    setPristine(true);
  }, []);

  // Store the initial reset state
  // in the resetRecords:
  useUpdate(() => {
    if (pristine) {
      setResetRecords((currentResetRecords) => ({
        ...currentResetRecords,
        [INITIAL_RESET_RECORD_KEY]: formData
      }));
    }
  }, [formData]);

  return {
    cancel,
    edit,
    errors,
    fieldToBeSet,
    focusedField,
    focusField,
    forceValidate,
    forceValidateFlag,
    getFieldId,
    isEdit,
    pristine,
    registerFieldErrors,
    reset,
    resetFlag,
    resetRecords,
    save,
    scrolledField,
    scrollFieldIntoView,
    setDirty,
    setFieldValue,
    setPristine,
    setResetFlag,
    setResetRecords
  };
};
