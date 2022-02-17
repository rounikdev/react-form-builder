import { createContext, FC, memo, useContext } from 'react';

import { FormDataProviderContext, FormRootProviderProps } from '../../types';

const FormDataContext = createContext<FormDataProviderContext>({
  errors: {},
  formData: { valid: false, value: {} }
});

export const useFormRoot = (): FormDataProviderContext => {
  return useContext(FormDataContext);
};

export const FormRootProvider: FC<FormRootProviderProps> = memo(({ children, value }) => {
  return <FormDataContext.Provider value={value}>{children}</FormDataContext.Provider>;
});

FormRootProvider.displayName = 'FormRootProvider';
