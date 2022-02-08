export interface Language {
  id: string; // EN
  label: string; // English
}

export interface LanguageData {
  [key: string]: string; // {..., firstName: 'First Name', ...}
}

export interface Dictionary extends Language {
  data: LanguageData;
}

export interface TranslationState {
  currentLanguageId: string;
  dictionaries: {
    [languageId: string]: Dictionary;
  };
}

export interface TranslationSetLanguageAction {
  payload: string;
  type: 'SET_LANGUAGE';
}

export type TranslationSubstitute = JSX.Element | string;

export interface TranslationContext {
  currentLanguage: Language;
  languages: Language[];
  setLanguage: (languageId: string) => void;
  translate: (
    key: string,
    substitutes?: TranslationSubstitute[]
  ) => string | TranslationSubstitute[];
}

export enum TranslationActions {
  SET_LANGUAGE = 'SET_LANGUAGE'
}
