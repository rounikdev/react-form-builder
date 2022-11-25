import { Dictionaries } from '../types';

export const dictionaries: Dictionaries = {
  BG: {
    data: {
      from: 'От',
      months: {
        april: 'април',
        august: 'август',
        december: 'декември',
        february: 'февруари',
        january: 'януари',
        july: 'юли',
        june: 'юни',
        march: 'март',
        may: 'май',
        november: 'ноември',
        october: 'октомври',
        september: 'септември'
      },
      myNameIs: 'Казвам се {#1}.',
      name: 'Име',
      required: 'Задължително',
      requiredField: 'Задължително поле',
      to: 'До',
      weekdays: {
        fr: 'пт',
        mo: 'пн',
        sa: 'сб',
        su: 'нд',
        th: 'чт',
        tu: 'вт',
        we: 'ср'
      }
    },
    id: 'BG',
    label: 'Български'
  },
  EN: {
    data: {
      from: 'From',
      months: {
        april: 'April',
        august: 'August',
        december: 'December',
        february: 'February',
        january: 'January',
        july: 'July',
        june: 'June',
        march: 'March',
        may: 'May',
        november: 'November',
        october: 'October',
        september: 'September'
      },
      myNameIs: 'My name is {#1}.',
      name: 'Name',
      required: 'Required',
      requiredField: 'Required field',
      to: 'To',
      validating: 'Validating',
      weekdays: {
        fr: 'Fri',
        mo: 'Mon',
        sa: 'Sat',
        su: 'Sun',
        th: 'Thu',
        tu: 'Tue',
        we: 'Wed'
      }
    },
    id: 'EN',
    label: 'English'
  }
};

export const languages = [
  { id: 'BG', label: 'Български' },
  { id: 'EN', label: 'English' }
];
