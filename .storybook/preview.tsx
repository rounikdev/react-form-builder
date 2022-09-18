import { Story } from '@storybook/react';

import { TranslationProvider } from '../src/core';
import { dictionaries } from '../src/core/Translation/tests/data';
import { BaseCSS } from '../src/ui';

export const decorators = [
  (StoryFn: Story) => (
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
