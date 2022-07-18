import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FC, StrictMode } from 'react';

import { FormRoot, RangeValue } from '@core';

import { Range } from '../Range';
import {
  RANGE_INITIAL_VALUE,
  RANGE_OPTIONS,
  RANGE_SINGLE_INITIAL_VALUE,
  RANGE_VOLUME_OPTIONS
} from './data';

import styles from './Range.stories.scss';

export default {
  component: Range,
  title: 'Components/inputs/Range'
} as ComponentMeta<typeof Range>;

const rangeFormatter = ({ newValue }: { newValue: RangeValue }) => {
  return {
    from: parseFloat(newValue.from.toFixed(2)),
    to: parseFloat(newValue.to.toFixed(2))
  };
};

const savingsValidator = (value: RangeValue) => {
  let validityCheck;

  if (value.from >= 1000) {
    validityCheck = {
      errors: [],
      valid: true
    };
  } else {
    validityCheck = {
      errors: [{ text: 'Savings should be at least 1000' }],
      valid: false
    };
  }

  return validityCheck;
};

const Template: ComponentStory<FC> = () => (
  <StrictMode>
    <FormRoot dataTest="form-with-datepicker">
      <div className={styles.Container}>
        <Range
          className={styles.Range}
          dataTest="savings"
          formatter={rangeFormatter}
          id="savings"
          initialValue={RANGE_INITIAL_VALUE}
          label="savings"
          max={10000}
          min={0}
          name="savings"
          stepExtra={100}
          validator={savingsValidator}
        />
        <Range
          className={styles.Range}
          dataTest="deviation"
          formatter={rangeFormatter}
          id="deviation"
          initialValue={RANGE_SINGLE_INITIAL_VALUE}
          label="deviation"
          max={10}
          min={-10}
          name="deviation"
          single={false}
          step={0.1}
        />
        <Range
          className={styles.Range}
          dataTest="points"
          formatter={rangeFormatter}
          id="points"
          initialValue={RANGE_SINGLE_INITIAL_VALUE}
          label="points"
          max={100}
          min={1}
          name="points"
          single
          step={0.1}
        />
        <Range
          className={styles.Range}
          dataTest="budget"
          formatter={rangeFormatter}
          id="budget"
          label="budget"
          name="budget"
          options={RANGE_OPTIONS}
        />
        <Range
          className={styles.Range}
          dataTest="volume"
          formatter={rangeFormatter}
          id="volume"
          initialValue={{ from: 0, to: 11 }}
          label="volume"
          name="volume"
          options={RANGE_VOLUME_OPTIONS}
          single
        />
        <Range
          className={styles.Range}
          dataTest="distance"
          formatter={rangeFormatter}
          hideBar
          id="distance"
          label="distance"
          name="distance"
          options={RANGE_OPTIONS}
          single
        />
      </div>
    </FormRoot>
  </StrictMode>
);

export const RangeDemo = Template.bind({});

RangeDemo.args = {};
