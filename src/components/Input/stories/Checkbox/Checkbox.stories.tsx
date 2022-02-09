import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Checkbox as CheckboxInput } from './Checkbox';

export default {
  component: CheckboxInput,
  title: 'Components/Input/Checkbox'
} as ComponentMeta<typeof CheckboxInput>;

const Template: ComponentStory<typeof CheckboxInput> = (args): JSX.Element => (
  <div style={{ width: '30rem' }}>
    <CheckboxInput {...args} />
  </div>
);

export const Checkbox = Template.bind({});
Checkbox.args = {
  dataTest: 'checkbox',
  disabled: false,
  hideRequiredLabel: false,
  id: 'checkbox',
  initialValue: false,
  label: 'Checkbox Label',
  name: 'checkbox'
};
