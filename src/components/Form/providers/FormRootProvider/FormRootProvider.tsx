import { createContext, FC, memo, useContext } from 'react';

import { FormRootProviderContext, FormRootProviderProps } from '../../types';

const FormDataContext = createContext<FormRootProviderContext>({
  errors: {},
  fieldToBeSet: {
    id: '',
    value: undefined
  },
  focusedField: '',
  formData: { valid: false, value: {} },
  methods: {
    focusField: () => {
      // default function
    },
    registerFieldErrors: undefined,
    scrollFieldIntoView: () => {
      // default function
    },
    setFieldValue: () => {
      // default function
    }
  },
  scrolledField: ''
});

export const useFormRoot = (): FormRootProviderContext => {
  return useContext(FormDataContext);
};

export const FormRootProvider: FC<FormRootProviderProps> = memo(({ children, value }) => {
  return <FormDataContext.Provider value={value}>{children}</FormDataContext.Provider>;
});

FormRootProvider.displayName = 'FormRootProvider';
