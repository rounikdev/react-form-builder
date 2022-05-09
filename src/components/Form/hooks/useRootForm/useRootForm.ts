import { useCallback, useState } from 'react';

import { useUpdate, useUpdatedRef, useUpdateOnly } from '@services';

import { INITIAL_RESET_RECORD_KEY, ROOT_RESET_RECORD_KEY } from '../../constants';
import {
  FieldErrors,
  FieldErrorsPayload,
  ForceValidateFlag,
  FormStateEntry,
  ResetFlag,
  SetFieldValuePayload
} from '../../types';

interface UseRootFormProps {
  formData: FormStateEntry;
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

  const [rootResetFlag, setRootResetFlag] = useState<ResetFlag>({
    resetKey: INITIAL_RESET_RECORD_KEY
  });

  const [resetRecords, setResetRecords] = useState<Record<string, FormStateEntry>>({});

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

    setRootResetFlag({ resetKey: ROOT_RESET_RECORD_KEY });

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
    setRootResetFlag({ resetKey: INITIAL_RESET_RECORD_KEY });

    setPristine(true);
  }, []);

  // Gather the initial state:
  useUpdate(() => {
    if (pristine) {
      setResetRecords((currentResetRecords) => ({
        ...currentResetRecords,
        [INITIAL_RESET_RECORD_KEY]: formData
      }));
    }
  }, [formData]);

  useUpdateOnly(() => {
    if (pristine) {
      setRootResetFlag({ resetKey: INITIAL_RESET_RECORD_KEY });
    }
  }, [pristine]);

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
    resetRecords,
    rootResetFlag,
    save,
    scrolledField,
    scrollFieldIntoView,
    setDirty,
    setFieldValue,
    setPristine,
    setResetRecords,
    setRootResetFlag
  };
};
