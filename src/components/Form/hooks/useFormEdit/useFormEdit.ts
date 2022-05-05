import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { useUpdatedRef, useUpdateOnly } from '@services';
import { FormStateEntry, ResetFlag } from '../../types';
import { INITIAL_RESET_RECORD_KEY } from '../../constants';

export const useFormEdit = ({
  fieldId,
  formData,
  pristine,
  setResetFlag,
  setResetRecords
}: {
  fieldId: string;
  formData: FormStateEntry;
  pristine: boolean;
  setResetFlag: Dispatch<SetStateAction<ResetFlag>>;
  setResetRecords: Dispatch<SetStateAction<Record<string, FormStateEntry>>>;
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const cancel = useCallback(() => {
    setIsEdit(false);

    setResetFlag({ resetKey: fieldId });

    setTimeout(() => {
      setResetRecords((currentResetRecords) => {
        const newResetRecords = { ...currentResetRecords };
        delete newResetRecords[fieldId];
        return newResetRecords;
      });
    });
  }, [fieldId, setResetFlag, setResetRecords]);

  const formDataRef = useUpdatedRef(formData);

  const edit = useCallback(() => {
    setIsEdit(true);

    setResetRecords((currentResetRecords) => {
      return {
        ...currentResetRecords,
        [fieldId]: formDataRef.current
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId, setResetRecords]); // formData makes Form test hang

  const save = useCallback(() => {
    setIsEdit(false);

    setResetRecords((currentResetRecords) => {
      const newResetRecords = { ...currentResetRecords };
      delete newResetRecords[fieldId];
      return newResetRecords;
    });
  }, [fieldId, setResetRecords]);

  useUpdateOnly(() => {
    if (pristine) {
      setResetFlag({ resetKey: INITIAL_RESET_RECORD_KEY });
    }
  }, [pristine]);

  return {
    cancel,
    edit,
    isEdit,
    save
  };
};
