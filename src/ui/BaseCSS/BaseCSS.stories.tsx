import { ComponentMeta, ComponentStory } from '@storybook/react';

import { BaseCSS } from './BaseCSS';

export default {
  component: BaseCSS,
  title: 'Components/BaseCSS'
} as ComponentMeta<typeof BaseCSS>;

const Template: ComponentStory<typeof BaseCSS> = (): JSX.Element => {
  return (
    <div>
      <h1>BaseCSS</h1>
      <BaseCSS />
    </div>
  );
};

export const Normalize = Template.bind({});
