import { FC, memo, createContext, useCallback, useMemo, useReducer, useContext } from 'react';

import dictionaries from './dictionaries';
import { reducer } from './reducer';
import {
  TranslationActions,
  TranslationContext,
  TranslationState,
  TranslationSubstitute
} from './types';

const initialContext: TranslationContext = {
  currentLanguage: { id: 'EN', label: 'English' },
  languages: [{ id: 'EN', label: 'English' }],
  setLanguage: () => {
    // default function
  },
  translate: (key) => key
};

const initialState: TranslationState = {
  currentLanguageId: 'EN',
  dictionaries
};

export const initialTranslationState = initialState;

const Context = createContext<TranslationContext>(initialContext);

export const splitTemplate = (
  template: string,
  substitutes: TranslationSubstitute[]
): TranslationSubstitute[] => {
  const transformA = template.split('{');

  const transformB = transformA
    .reduce((res, segment) => {
      const splitSegment = segment.split('}');

      res = [...res, ...splitSegment];

      return res;
    }, [] as string[])
    .filter(Boolean);

  return transformB.map((el) => {
    if (el.indexOf('#') === 0) {
      const index = parseInt(el.substring(1)) - 1;

      return substitutes[index];
    } else {
      return el;
    }
  });
};

export const TranslationProvider: FC = memo(({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLanguage = useCallback((languageId: string) => {
    dispatch({
      payload: languageId,
      type: TranslationActions.SET_LANGUAGE
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
    (key: string, substitutes: TranslationSubstitute[] = []) => {
      const { data = {} } = state.dictionaries[state.currentLanguageId] || {};

      const translated = data[key] || key;

      if (substitutes.length === 0) {
        return translated;
      } else {
        return splitTemplate(translated, substitutes);
      }
    },
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
      translate
    };
  }, [setLanguage, state, translate]);

  return <Context.Provider value={context}>{children}</Context.Provider>;
});

TranslationProvider.displayName = 'TranslationProvider';

export const useTranslation = (): TranslationContext => {
  return useContext(Context);
};
