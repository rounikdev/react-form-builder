import {
  createContext,
  FC,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

import { FormData, FormStorageContextType } from '@core/Form/types';

const initialFormStorageContext = {
  removeFormData: () => {
    // Default implementation
  },
  setFormData: () => {
    // Default implementation
  },
  state: {}
};

const FormStorageContext = createContext<FormStorageContextType>(initialFormStorageContext);

export const useFormStorage = (): FormStorageContextType => {
  return useContext(FormStorageContext);
};

interface FormStorageProviderProps {
  children: ReactNode;
}

export const FormStorageProvider: FC<FormStorageProviderProps> = memo(({ children }) => {
  const [state, setState] = useState<FormStorageContextType['state']>({});

  const removeFormData = useCallback(({ formId }: { formData: FormData; formId: string }) => {
    setState((currentState) => {
      const newState = { ...currentState };

      delete newState[formId];

      return newState;
    });
  }, []);

  const setFormData = useCallback(
    ({ formData, formId }: { formData: FormData; formId: string }) => {
      setState((currentState) => ({ ...currentState, [formId]: formData }));
    },
    []
  );

  const value = useMemo(
    () => ({
      removeFormData,
      setFormData,
      state
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return <FormStorageContext.Provider value={value}>{children}</FormStorageContext.Provider>;
});

FormStorageContext.displayName = 'FormStorageContext';

FormStorageProvider.displayName = 'FormStorageProvider';
