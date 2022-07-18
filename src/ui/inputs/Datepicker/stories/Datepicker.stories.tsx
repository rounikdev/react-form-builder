import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FC, StrictMode } from 'react';

import { FormRoot } from '@core';
import { ValidatorModel } from '@services';

import { Datepicker } from '../Datepicker';

import styles from './Datepicker.stories.scss';

export default {
  component: Datepicker,
  title: 'Components/inputs/Datepicker'
} as ComponentMeta<typeof Datepicker>;

const Template: ComponentStory<FC> = () => (
  <StrictMode>
    <FormRoot dataTest="form-with-datepicker">
      <div className={styles.DatepickersContainer}>
        <Datepicker
          dataTest="from"
          id="from"
          label="from"
          name="from"
          required
          validator={ValidatorModel.requiredValidator}
        />
        <Datepicker
          dataTest="between"
          id="between"
          name="between"
          minDateExtractor={(formValue) => formValue?.from}
          maxDateExtractor={(formValue) => formValue?.to}
          required
          validator={ValidatorModel.requiredValidator}
          useEndOfDay
        />
        <Datepicker
          dataTest="to"
          id="to"
          label="to"
          name="to"
          minDateExtractor={(formValue) => formValue?.from}
          useEndOfDay
        />
      </div>
    </FormRoot>
  </StrictMode>
);

export const DatepickerDemo = Template.bind({});

DatepickerDemo.args = {};
