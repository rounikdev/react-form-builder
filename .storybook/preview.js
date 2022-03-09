import React from 'react';

import { BaseCSS } from '../src/components/BaseCSS/BaseCSS';

export const decorators = [
  (StoryFn) => (
    <>
      <BaseCSS />
      <StoryFn />
    </>
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
