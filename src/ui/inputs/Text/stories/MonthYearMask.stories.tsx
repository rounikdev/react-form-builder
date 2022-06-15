import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FormatterModel, ValidatorModel } from '@services';
import { Text as TextInput } from '../Text';

export default {
  component: TextInput,
  title: 'Components/inputs/Text',
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
  disabled: false,
  formatter: FormatterModel.monthYearFormatter,
  id: 'monthYear',
  label: 'Month Year',
  name: 'monthYear',
  pattern: FormatterModel.monthYearPattern,
  required: true,
  validator: ValidatorModel.composeValidators(
    ValidatorModel.requiredValidator,
    ValidatorModel.monthYearValidator
  )
};
