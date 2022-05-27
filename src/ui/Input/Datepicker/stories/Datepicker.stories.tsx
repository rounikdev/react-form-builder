import { FC } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FormRoot } from '@components';

import { Datepicker } from '../Datepicker';

import styles from './Datepicker.stories.scss';

export default {
  title: 'Components/Datepicker',
  component: Datepicker
} as ComponentMeta<typeof Datepicker>;

const Template: ComponentStory<FC> = () => (
  <FormRoot dataTest="form-with-datepicker">
    <div className={styles.DatepickersContainer}>
      <Datepicker dataTest="from" id="from" label="From" name="from" />
      <Datepicker
        dataTest="to"
        id="to"
        label="To"
        name="to"
        minDateExtractor={(formValue) => formValue?.from}
        useEndOfDay
      />
    </div>
  </FormRoot>
);

export const DatepickerDemo = Template.bind({});

DatepickerDemo.args = {};
