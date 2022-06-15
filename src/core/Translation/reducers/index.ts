import {
  TranslationActions,
  TranslationSetLanguageAction,
  TranslationState,
  TranslationUpdateDictionariesAction
} from '../types';

export const reducer = (
  state: TranslationState,
  action: TranslationSetLanguageAction | TranslationUpdateDictionariesAction
): TranslationState => {
  switch (action.type) {
    case TranslationActions.SET_LANGUAGE:
      return {
        ...state,
        currentLanguageId: action.payload
      };
    case TranslationActions.UPDATE_DICTIONARIES:
      return {
        ...state,
        dictionaries: {
          ...state.dictionaries,
          ...action.payload
        }
      };
    default:
      return state;
  }
};
