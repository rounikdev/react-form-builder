export enum TranslationActions {
  SET_LANGUAGE = 'SET_LANGUAGE',
  UPDATE_DICTIONARIES = 'UPDATE_DICTIONARIES'
}

export interface Language {
  id: string; // EN
  label: string; // English
}

export interface LanguageData {
  [key: string]: string | LanguageData; // {..., firstName: 'First Name', ...}
}

export interface Dictionary extends Language {
  data: LanguageData;
}

export type Dictionaries = Record<string, Dictionary>;

export interface TranslationState {
  currentLanguageId: string;
  dictionaries: Dictionaries;
}

export interface TranslationSetLanguageAction {
  payload: string;
  type: TranslationActions.SET_LANGUAGE;
}

export interface TranslationUpdateDictionariesAction {
  payload: Dictionaries;
  type: TranslationActions.UPDATE_DICTIONARIES;
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
  updateDictionaries: (dictionaries: Dictionaries) => void;
}

export interface TranslationProviderProps {
  languageId: string;
  dictionaries: Dictionaries;
}

export interface TranslationProps {
  substitutes?: TranslationSubstitute[];
  text: string;
}
