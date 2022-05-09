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

export const MonthYear = Template.bind({});
MonthYear.args = {
  dataTest: 'month-year',
  formatter: InputModel.monthYearFormatter,
  id: 'monthYear',
  label: 'Month Year',
  name: 'monthYear',
  pattern: InputModel.monthYearPattern,
  required: true,
  validator: ValidatorModel.composeValidators(
    ValidatorModel.requiredValidator,
    ValidatorModel.monthYearValidator
  )
};
