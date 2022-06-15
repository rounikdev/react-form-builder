import { FC, memo, useCallback, useMemo, useReducer } from 'react';

import { TranslationContextInstance } from '../../context';
import { reducer } from '../../reducers';
import { translateFactory } from '../../services';
import {
  Dictionaries,
  TranslationActions,
  TranslationProviderProps,
  TranslationSubstitute
} from '../../types';

export const TranslationProvider: FC<TranslationProviderProps> = memo(
  ({ children, dictionaries, languageId }) => {
    const [state, dispatch] = useReducer(reducer, {
      currentLanguageId: languageId,
      dictionaries
    });

    const setLanguage = useCallback((languageId: string) => {
      dispatch({
        payload: languageId,
        type: TranslationActions.SET_LANGUAGE
      });
    }, []);

    const updateDictionaries = useCallback((dictionaries: Dictionaries) => {
      dispatch({
        payload: dictionaries,
        type: TranslationActions.UPDATE_DICTIONARIES
      });
    }, []);

    // NB: This method can be provided when mounting
    // sub apps. So that's why its not returning
    // JSX but either a string or a list of strings
    // and substitutes (they could contain framework
    // specific markup).So the rendering should
    // happen in the context of the sub-app and its
    // specific framework.
    const translate = useCallback(
      (key: string, substitutes?: TranslationSubstitute[]) =>
        translateFactory(state)(key, substitutes),
      [state]
    );

    const context = useMemo(() => {
      const { id, label } = state.dictionaries[state.currentLanguageId] || {};

      const languages = Object.values(state.dictionaries).map((dictionary) => ({
        id: dictionary.id,
        label: dictionary.label
      }));

      return {
        currentLanguage: {
          id,
          label
        },
        languages,
        setLanguage,
        translate,
        updateDictionaries
      };
    }, [setLanguage, state, translate, updateDictionaries]);

    return (
      <TranslationContextInstance.Provider value={context}>
        {children}
      </TranslationContextInstance.Provider>
    );
  }
);

TranslationProvider.displayName = 'TranslationProvider';
