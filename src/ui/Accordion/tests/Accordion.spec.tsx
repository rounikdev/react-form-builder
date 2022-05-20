import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import Meta, { Basic as BasicStory } from '../stories/Accordion.stories';

const AccordionDemo = composeStory(BasicStory, Meta);

describe('Accordion', () => {
  it('TODO', () => {
    mount(<AccordionDemo />);
  });
});
