import { createContext, FC, memo, useContext } from 'react';

import { FormRootProviderContext, FormRootProviderProps } from '@core/Form/types';

const FormRootContext = createContext<FormRootProviderContext>({
  errors: {},
  fieldToBeSet: {
    id: '',
    value: undefined
  },
  focusedField: '',
  formData: {},
  methods: {
    focusField: () => {
      // default function
    },
    registerFieldErrors: undefined,
    scrollFieldIntoView: () => {
      // default function
    },
    setDirty: () => {
      // default function
    },
    setFieldValue: () => {
      // default function
    },
    setResetFlag: () => {
      // default function
    },
    setResetRecords: () => {
      // default function
    }
  },
  pristine: true,
  resetFlag: { resetKey: '' },
  resetRecords: {},
  scrolledField: ''
});

export const useFormRoot = (): FormRootProviderContext => {
  return useContext(FormRootContext);
};

export const FormRootProvider: FC<FormRootProviderProps> = memo(({ children, value }) => {
  return <FormRootContext.Provider value={value}>{children}</FormRootContext.Provider>;
});

FormRootContext.displayName = 'FormRootContext';

FormRootProvider.displayName = 'FormRootProvider';
