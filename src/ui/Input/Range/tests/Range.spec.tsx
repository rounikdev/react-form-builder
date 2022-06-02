import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import Meta, { RangeDemo } from '../stories/Range.stories';

const RangeStory = composeStory(RangeDemo, Meta);

const content = (
  <div style={{ margin: '5rem 0 5rem 20rem' }}>
    <RangeStory />
  </div>
);

describe('Range', () => {
  it('TODO', () => {
    mount(content);
  });
});
