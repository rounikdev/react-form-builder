import { useContext } from 'react';

import { TranslationContextInstance } from '../../context';
import { TranslationContext } from '../../types';

export const useTranslation = (): TranslationContext => {
  return useContext(TranslationContextInstance);
};
