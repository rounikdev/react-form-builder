import { createContext, FC, memo, useContext } from 'react';

import { FormDataProviderContext, FormDataProviderProps } from './types';

const FormDataContext = createContext<FormDataProviderContext>({
  errors: {},
  formData: { valid: false, value: {} }
});

export const useFormData = (): FormDataProviderContext => {
  return useContext(FormDataContext);
};

export const FormDataProvider: FC<FormDataProviderProps> = memo(({ children, value }) => {
  return <FormDataContext.Provider value={value}>{children}</FormDataContext.Provider>;
});

FormDataProvider.displayName = 'FormDataProvider';
