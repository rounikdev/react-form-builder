import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ValidatorModel } from '@services';

import { Checkbox as CheckboxInput } from '../Checkbox';

export default {
  component: CheckboxInput,
  title: 'Components/inputs/Checkbox'
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
  initialValue: () => true,
  label: 'Checkbox Label',
  name: 'checkbox',
  required: true,
  validator: ValidatorModel.requiredValidator
};
