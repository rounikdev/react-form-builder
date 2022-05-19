import { ValidityCheck } from '@components';

export interface Fruit {
  id: string;
  label: string;
}

export const options: Fruit[] = [
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

export const fruitsValidator = (value: Fruit[]): ValidityCheck => {
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
