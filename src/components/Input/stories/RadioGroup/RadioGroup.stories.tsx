import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Form, FormUser } from '@components';

import { RadioGroup as RadioGroupInput } from './RadioGroup';

export default {
  component: RadioGroupInput,
  title: 'Components/Input'
} as ComponentMeta<typeof RadioGroupInput>;

const Template: ComponentStory<typeof RadioGroupInput> = (args): JSX.Element => (
  <div style={{ width: '40rem' }}>
    <Form formTag>
      <FormUser>
        {({ formData }) => {
          console.log('formData: ', formData);

          return <RadioGroupInput {...args} />;
        }}
      </FormUser>
    </Form>
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
  initialValue: options[2].value,
  name: 'radio-group',
  options,
  required: true
};
