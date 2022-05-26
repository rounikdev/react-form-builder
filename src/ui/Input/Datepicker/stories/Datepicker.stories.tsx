import { FC } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FormRoot } from '@components';

import { Standard } from '../views';

import styles from './Datepicker.stories.scss';

export default {
  title: 'Components/Datepicker',
  component: Standard
} as ComponentMeta<typeof Standard>;

const Template: ComponentStory<FC> = () => (
  <FormRoot dataTest="form-with-autocomplete">
    <Standard dataTest="from" id="from" label="From" name="from" />
    <Standard
      dataTest="to"
      id="to"
      label="To"
      name="to"
      minDateExtractor={(formValue) => formValue?.from}
      useEndOfDay
    />
  </FormRoot>
);

export const DatepickerDemo = Template.bind({});

DatepickerDemo.args = {};
