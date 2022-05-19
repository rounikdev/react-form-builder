import { ComponentMeta, Story } from '@storybook/react';

import { FormRoot } from '@components';

import { Autocomplete } from '../Autocomplete';
import { Option } from '../components';
import { AutocompleteProps } from '../types';

import { Fruit, fruitsValidator, options } from './data';

import styles from './Autocomplete.stories.scss';

export default {
  title: 'Components/Autocomplete',
  component: Autocomplete
} as ComponentMeta<typeof Autocomplete>;

const Template =
  <T,>(): Story<AutocompleteProps<T>> =>
  (args) =>
    (
      <FormRoot dataTest="form-with-autocomplete">
        <Autocomplete {...args} />
      </FormRoot>
    );

export const Basic = Template<Fruit>().bind({});

Basic.args = {
  autocomplete: true,
  children: ({ options }) => {
    return options.map((option) => (
      <Option dataTest={option.id} id={option.id} key={option.id} text={option.label} />
    ));
  },
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
  validator: fruitsValidator
};
