import { ComponentMeta, Story } from '@storybook/react';

import { FormRoot } from '@core';

import { Autocomplete } from '../Autocomplete';
import { Option } from '../components';
import { AutocompleteProps } from '../types';
import { Fruit, fruitsValidator, options } from './data';

import styles from './Autocomplete.stories.scss';

export default {
  component: Autocomplete,
  title: 'Components/inputs/Autocomplete'
} as ComponentMeta<typeof Autocomplete>;

const Template =
  <T,>(): Story<AutocompleteProps<T>> =>
  // eslint-disable-next-line react/display-name
  (args) =>
    (
      <FormRoot dataTest="form-with-autocomplete">
        <Autocomplete {...args} />
      </FormRoot>
    );

export const Basic = Template<Fruit>().bind({});

Basic.args = {
  autocomplete: true,
  className: styles.Autocomplete,
  dataTest: 'test-autocomplete',
  extractId: (item) => item?.id ?? '',
  extractLabel: (item) => item.label,
  id: 'fruits',
  initialValue: [options[1]],
  label: 'Fruits',
  list: options,
  multi: true,
  name: 'fruits',
  renderOption: ({ item, ref }) => (
    <Option dataTest={item.id} id={item.id} key={item.id} ref={ref} text={item.label} />
  ),
  required: true,
  validator: fruitsValidator
};
