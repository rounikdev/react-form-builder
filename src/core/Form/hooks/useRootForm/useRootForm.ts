import { useCallback, useState } from 'react';

import { useUpdate, useUpdatedRef } from '@rounik/react-custom-hooks';

import {
  INITIAL_RESET_RECORD_KEY,
  NO_RESET_KEY,
  ROOT_RESET_RECORD_KEY,
  STORAGE_RESET_KEY
} from '@core/Form/constants';
import {
  FieldErrors,
  FieldErrorsPayload,
  ForceValidateFlag,
  ForceValidateMethod,
  FormStateEntryValue,
  InjectedErrors,
  ResetFlag,
  SetFieldsValuePayload
} from '@core/Form/types';

interface UseRootFormProps {
  formData: FormStateEntryValue;
  initialResetState?: FormStateEntryValue;
  usesStorage?: boolean;
}

export const useRootForm = ({ formData, initialResetState, usesStorage }: UseRootFormProps) => {
  const [fieldsToBeSet, setFieldsValueState] = useState<SetFieldsValuePayload>({});

  const [errors, setErrors] = useState<FieldErrors>({});

  const [injectedErrors, setInjectedErrors] = useState<InjectedErrors>({});

  const [pristine, setPristine] = useState<boolean>(true);

  const [focusedField, focusField] = useState('');

  const [scrolledField, scrollFieldIntoView] = useState('');

  const [forceValidateFlag, setForceValidateFlag] = useState<ForceValidateFlag | null>(null);

  const [resetFlag, setResetFlag] = useState<ResetFlag>({
    resetKey: NO_RESET_KEY
  });

  const [resetRecords, setResetRecords] = useState<Record<string, FormStateEntryValue>>({});

  const setFieldsValue = useCallback(
    (value: SetFieldsValuePayload) =>
      setFieldsValueState((prevState) => ({ ...prevState, ...value })),
    []
  );

  const injectErrors = useCallback((value: InjectedErrors) => setInjectedErrors(value), []);

  const forceValidate: ForceValidateMethod = useCallback((customForceValidateFlag = {}) => {
    setForceValidateFlag(customForceValidateFlag);
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

  const usesStorageRef = useUpdatedRef(usesStorage);

  const reset = useCallback(({ resetList }: { resetList?: string[] } = {}) => {
    if (resetList) {
      setResetFlag({ resetKey: NO_RESET_KEY, resetList });
    } else {
      setResetFlag({
        resetKey: usesStorageRef.current ? STORAGE_RESET_KEY : INITIAL_RESET_RECORD_KEY
      });
      setPristine(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (usesStorage && initialResetState) {
      setResetRecords((currentResetRecords) => ({
        ...currentResetRecords,
        [INITIAL_RESET_RECORD_KEY]: initialResetState
      }));
    }
  }, [formData, initialResetState]);

  return {
    cancel,
    edit,
    errors,
    fieldsToBeSet,
    focusedField,
    focusField,
    forceValidate,
    forceValidateFlag,
    getFieldId,
    injectedErrors,
    injectErrors,
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
    setFieldsValue,
    setPristine,
    setResetFlag,
    setResetRecords
  };
};
