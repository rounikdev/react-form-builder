import { TranslationActions, TranslationSetLanguageAction, TranslationState } from './types';

export const reducer = (
  state: TranslationState,
  action: TranslationSetLanguageAction
): TranslationState => {
  switch (action.type) {
    case TranslationActions.SET_LANGUAGE:
      return {
        ...state,
        currentLanguageId: action.payload
      };
    default:
      return state;
  }
};
