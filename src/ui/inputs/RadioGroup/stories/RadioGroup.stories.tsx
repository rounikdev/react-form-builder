/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FormRoot, FormUser } from '@core';

import { RadioGroup as RadioGroupInput } from '../RadioGroup';

export default {
  component: RadioGroupInput,
  title: 'Components/inputs'
} as ComponentMeta<typeof RadioGroupInput>;

const Template: ComponentStory<typeof RadioGroupInput> = (args): JSX.Element => (
  <div style={{ width: '60rem' }}>
    <FormRoot dataTest="root-form">
      <FormUser>
        {() => {
          return <RadioGroupInput {...args} />;
        }}
      </FormUser>
    </FormRoot>
  </div>
);

const options = [
  {
    label: 'Chocolate',
    value: 'chocolate'
  },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Vanilla', value: 'vanilla' }
];

export const RadioGroup = Template.bind({});
RadioGroup.args = {
  dataTest: 'radio-group',
  dependencyExtractor: () => {},
  disabled: false,
  groupLabel: 'Radio Group Label',
  id: 'radio-group',
  initialValue: () => `${options[1].value} value`,
  inputValueExtractor: (option: any) => `${option.value} value`,
  labelExtractor: (option: any) => `${option.label} label`,
  name: 'radio-group',
  options,
  required: true,
  titleExtractor: (option: any) => `${option.label} title`,
  valueExtractor: (option: any) => `${option.value} value`
};
