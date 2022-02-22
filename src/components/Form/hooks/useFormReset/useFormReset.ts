import { useCallback, useState } from 'react';

import { useUpdatedRef } from '@services';
import { useFormRoot } from '../../providers';

export const useFormReset = ({ fieldId, reset }: { fieldId: string; reset: () => void }) => {
  const {
    formData,
    methods: { setResetRecords }
  } = useFormRoot();

  const [isEdit, setIsEdit] = useState(false);

  const cancel = useCallback(() => {
    setIsEdit(false);

    reset();

    setTimeout(() => {
      setResetRecords((currentResetRecords) => {
        const newResetRecords = { ...currentResetRecords };
        delete newResetRecords[fieldId];
        return newResetRecords;
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId, reset]);

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
  }, [fieldId]); // formData makes Form test hang

  const save = useCallback(() => {
    setIsEdit(false);
    setResetRecords((currentResetRecords) => {
      const newResetRecords = { ...currentResetRecords };
      delete newResetRecords[fieldId];
      return newResetRecords;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldId]);

  return {
    cancel,
    edit,
    isEdit,
    save
  };
};
