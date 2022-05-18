import { ComponentMeta, Story } from '@storybook/react';

import { FormRoot, ValidityCheck } from '@components';

import { Autocomplete } from '../Autocomplete';
import { Option } from '../components';
import { AutocompleteProps } from '../types';

import styles from './Autocomplete.stories.scss';

export default {
  title: 'Components/Autocomplete',
  component: Autocomplete
} as ComponentMeta<typeof Autocomplete>;

interface Fruit {
  id: string;
  label: string;
}

const Template =
  <T,>(): Story<AutocompleteProps<T>> =>
  (args) =>
    (
      <FormRoot dataTest="form-with-autocomplete">
        <Autocomplete {...args} />
      </FormRoot>
    );

const fruitsValidator = (value: Fruit[]): ValidityCheck => {
  let validityCheck: ValidityCheck = {
    errors: [],
    valid: true
  };

  if (value.length < 2) {
    validityCheck = {
      errors: [{ text: 'Select at least 2 fruits' }],
      valid: false
    };
  }

  return validityCheck;
};

const options: Fruit[] = [
  {
    id: 'apples',
    label: 'apples'
  },
  {
    id: 'bananas',
    label: 'bananas'
  },
  {
    id: 'strawberries',
    label: 'strawberries'
  },
  { id: 'pears', label: 'pears' },
  { id: 'blackberries', label: 'blackberries' },
  { id: 'mellon', label: 'mellon' }
];

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
