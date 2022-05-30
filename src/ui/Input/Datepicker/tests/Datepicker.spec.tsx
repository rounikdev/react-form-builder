import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import { TranslationProvider } from '@components';
import { dictionaries } from '@components/Translation/tests/data';

import Meta, { DatepickerDemo } from '../stories/Datepicker.stories';

const DatepickerStory = composeStory(DatepickerDemo, Meta);

describe('Datepicker', () => {
  it('Selects date', () => {
    mount(
      <TranslationProvider dictionaries={dictionaries} languageId={dictionaries.EN.id}>
        <div style={{ margin: '5rem 0 5rem 20rem' }}>
          <DatepickerStory />
        </div>
      </TranslationProvider>
    );
  });
});
