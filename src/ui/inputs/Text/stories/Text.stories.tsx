import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Text as TextInput } from '../Text';

export default {
  component: TextInput,
  parameters: { actions: { argTypesRegex: null } },
  title: 'Components/inputs/Text'
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args): JSX.Element => (
  <div style={{ width: '30rem' }}>
    <TextInput {...args} />
  </div>
);

export const Text = Template.bind({});
Text.args = {
  autoComplete: 'off',
  dataTest: 'text',
  dependencyExtractor: () => {},
  disabled: false,
  formatter: ({ newValue }: { newValue: string }) => newValue,
  hidden: false,
  id: 'text',
  initialValue: 'Text',
  label: 'Text Label',
  name: 'text',
  onBlurSideEffect: ({ setValue }) => {
    if (setValue) {
      setValue('90');
    }

    return '90';
  },
  placeholder: 'text'
};
