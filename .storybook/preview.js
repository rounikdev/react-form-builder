import React from 'react';

import { BaseCSS, TranslationProvider } from '../src/components';

import { dictionaries } from '../src/components/Translation/tests/data';

export const decorators = [
  (StoryFn) => (
    <TranslationProvider dictionaries={dictionaries} languageId={dictionaries.EN.id}>
      <BaseCSS />
      <StoryFn />
    </TranslationProvider>
  )
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  layout: 'centered'
};
