import { Dictionaries } from '../types';

export const dictionaries: Dictionaries = {
  BG: {
    id: 'BG',
    data: {
      name: 'Име',
      myNameIs: 'Казвам се {#1}.'
    },
    label: 'Български'
  },
  EN: {
    data: {
      name: 'Name',
      myNameIs: 'My name is {#1}.'
    },
    id: 'EN',
    label: 'English'
  }
};

export const languages = [
  { id: 'BG', label: 'Български' },
  { id: 'EN', label: 'English' }
];
