import { useState } from 'react';

import { SetFieldValuePayload } from '../../types';

export const useFormFieldInteraction = () => {
  const [fieldToBeSet, setFieldValue] = useState<SetFieldValuePayload>({
    id: '',
    value: undefined
  });

  const [focusedField, focusField] = useState('');

  const [scrolledField, scrollFieldIntoView] = useState('');

  return {
    fieldToBeSet,
    focusedField,
    focusField,
    scrolledField,
    scrollFieldIntoView,
    setFieldValue
  };
};
