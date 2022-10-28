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

const initialFormStorageContext: FormStorageContextType = {
  removeFormData: () => {
    // Default implementation
  },
  resetFormData: () => {
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

  const removeFormData = useCallback(({ formId }: { formId: string }) => {
    setState((currentState) => {
      const newState = { ...currentState };

      delete newState[formId];

      return newState;
    });
  }, []);

  const resetFormData = useCallback(({ formId }: { formId: string }) => {
    setState((currentState) => {
      const newState = { ...currentState };

      if (newState[formId]) {
        newState[formId].value = {};
      }

      return newState;
    });
  }, []);

  const setFormData = useCallback(
    ({ formData, formId }: { formData: FormData; formId: string }) => {
      setState((currentState) => {
        const newState = { ...formData };

        // Keep the initially set reset state:
        if (currentState[formId]?.resetState || newState.resetState === null) {
          newState.resetState = currentState[formId]?.resetState;
        }

        // No value saved here while pristine:
        // (formData.value === undefined)
        if (formData.pristine) {
          newState.value = currentState[formId]?.value ?? {};
        }

        return { ...currentState, [formId]: newState };
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      removeFormData,
      resetFormData,
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
