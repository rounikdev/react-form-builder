import { ComponentStory, ComponentMeta } from '@storybook/react';

import { InputModel, ValidatorModel } from '@services';
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
  formatter: InputModel.creditCardFormatter,
  id: 'creditCard',
  label: 'Credit Card',
  name: 'creditCard',
  pattern: InputModel.creditCardPattern,
  required: true,
  validator: ValidatorModel.composeValidators(
    ValidatorModel.requiredValidator,
    ValidatorModel.creditCardValidator
  )
};
