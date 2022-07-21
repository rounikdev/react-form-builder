import { createContext } from 'react';

import { TranslationContext } from '../types';

export const initialTranslationContext: TranslationContext = {
  currentLanguage: { id: '', label: '' },
  languages: [],
  setLanguage: () => {
    // default function
  },
  translate: (key) => key,
  translateToString: (key) => key,
  updateDictionaries: () => {
    // default function
  }
};

export const TranslationContextInstance =
  createContext<TranslationContext>(initialTranslationContext);

TranslationContextInstance.displayName = 'TranslationContext';
