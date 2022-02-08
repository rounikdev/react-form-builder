import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Primary as PrimaryInput } from '../Primary/Primary';

export default {
  component: PrimaryInput,
  title: 'Components/Input/Primary'
} as ComponentMeta<typeof PrimaryInput>;

const Template: ComponentStory<typeof PrimaryInput> = (args): JSX.Element => (
  <div style={{ width: '30rem' }}>
    <PrimaryInput {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  autoComplete: 'off',
  dataTest: 'primary',
  dependencyExtractor: () => {},
  disabled: false,
  formatter: ({ newValue }: { newValue: string }) => newValue,
  hidden: false,
  id: 'primary',
  initialValue: 'Primary',
  label: 'Primary Label',
  name: 'primary',
  placeholder: 'primary',
  required: true,
  requiredLabel: 'requiredForHMRC'
};
