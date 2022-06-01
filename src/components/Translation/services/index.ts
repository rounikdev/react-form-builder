import { GlobalModel } from '@services';

import { TranslationState, TranslationSubstitute } from '../types';

/**
 *
 * @param template - like 'My name is {#1} :)'
 * where {#i} is the 1-based placeholder
 * for a substitute
 *
 * @param substitutes - an array like [<div>Ivan</div>]
 * @returns TranslationSubstitute[] - a string
 * or an array like ['My name is ', <div>Ivan</div>, ' :)']
 */
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
    .filter(Boolean); // ['text', #1, 'another text', #2, 'some other text', #1, ... ]

  // Replace the `#i` placeholders
  // with the provided substitutes:
  return transformB.map((el) => {
    if (el.indexOf('#') === 0) {
      // -1 is because we transform from 1-based to 0-based
      const substituteIndex = parseInt(el.substring(1)) - 1;

      return substitutes[substituteIndex];
    } else {
      return el;
    }
  });
};

export const translateFactory =
  (state: TranslationState) => (key: string, substitutes?: TranslationSubstitute[]) => {
    const { data = {} } = state.dictionaries[state.currentLanguageId] || {};

    const translation: string = GlobalModel.getNestedValue(data, key.split('.')) || key;

    if (!substitutes) {
      return translation;
    } else {
      // Here we assume that we have a template
      // with substitutes placeholders:
      return splitTemplate(translation, substitutes);
    }
  };
