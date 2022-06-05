/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FormRoot, FormUser } from '@components';

import { RadioGroup as RadioGroupInput } from '@ui';

export default {
  component: RadioGroupInput,
  title: 'Components/Input'
} as ComponentMeta<typeof RadioGroupInput>;

const Template: ComponentStory<typeof RadioGroupInput> = (args): JSX.Element => (
  <div style={{ width: '40rem' }}>
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
    value: 'chocolate',
    label: 'Chocolate'
  },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

export const RadioGroup = Template.bind({});
RadioGroup.args = {
  dataTest: 'radio-group',
  dependencyExtractor: () => {},
  disabled: false,
  groupLabel: 'Radio Group Label',
  id: 'radio-group',
  initialValue: `${options[2].value} value`,
  inputValueExtractor: (option: any) => `${option.value} value`,
  labelExtractor: (option: any) => `${option.label} label`,
  name: 'radio-group',
  options,
  required: true,
  titleExtractor: (option: any) => `${option.label} title`,
  valueExtractor: (option: any) => `${option.value} value`
};
