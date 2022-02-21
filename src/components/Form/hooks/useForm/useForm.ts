import { useContext } from 'react';

import { FormContextInstance } from '../../context';
import { FormContext } from '../../types';

export const useForm = (): FormContext => {
  return useContext(FormContextInstance);
};
