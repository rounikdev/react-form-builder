import { useContext } from 'react';

import { FormContextInstance } from '@core/Form/context';
import { FormContext } from '@core/Form/types';

export const useForm = (): FormContext => {
  return useContext(FormContextInstance);
};
