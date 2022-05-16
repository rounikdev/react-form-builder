import { ComponentMeta, Story } from '@storybook/react';

import { Autocomplete } from '../Autocomplete';
import { Option } from '../components';
import { AutocompleteProps } from '../types';

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
    <Autocomplete {...args} />;

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
  { id: 'pears', label: 'pears' }
];

export const Basic = Template<Fruit>().bind({});

Basic.args = {
  children: ({ options }) => {
    return options.map((option) => (
      <Option dataTest={option.id} id={option.id} key={option.id} text={option.label} />
    ));
  },
  dataTest: 'test-autocomplete',
  extractId: (item) => item?.id ?? '',
  extractLabel: (item) => item.label,
  id: 'fruits',
  label: 'Fruits',
  list: options,
  multi: true
};
