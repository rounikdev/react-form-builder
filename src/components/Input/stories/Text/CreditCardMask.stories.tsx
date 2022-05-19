import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FormatterModel, ValidatorModel } from '@services';
import { Text as TextInput } from '@ui';

export default {
  component: TextInput,
  title: 'Components/Input/Text',
  parameters: { actions: { argTypesRegex: null } }
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args): JSX.Element => (
  <div style={{ width: '30rem' }}>
    <TextInput {...args} />
  </div>
);

export const CreditCardMask = Template.bind({});
CreditCardMask.args = {
  dataTest: 'credit-card',
  disabled: false,
  formatter: FormatterModel.creditCardFormatter,
  id: 'creditCard',
  label: 'Credit Card',
  name: 'creditCard',
  pattern: FormatterModel.creditCardPattern,
  required: true,
  validator: ValidatorModel.composeValidators(
    ValidatorModel.requiredValidator,
    ValidatorModel.creditCardValidator
  )
};
