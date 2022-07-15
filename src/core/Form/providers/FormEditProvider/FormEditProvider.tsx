import { createContext, FC, memo, ReactNode, useContext, useMemo } from 'react';

interface FormEditContextValue {
  isEdit: boolean;
}

interface FormEditProviderProps {
  children: ReactNode;
  isEdit: boolean;
}

const initialFormEditContextValue = { isEdit: false };

const FormEditContext = createContext<FormEditContextValue>(initialFormEditContextValue);

export const useFormEditContext = () => {
  return useContext(FormEditContext);
};

export const FormEditProvider: FC<FormEditProviderProps> = memo(({ children, isEdit }) => {
  return (
    <FormEditContext.Provider value={useMemo(() => ({ isEdit }), [isEdit])}>
      {children}
    </FormEditContext.Provider>
  );
});

FormEditProvider.displayName = 'FormEditProvider';
