import { Dictionaries } from '../types';

export const dictionaries: Dictionaries = {
  BG: {
    id: 'BG',
    data: {
      from: 'От',
      months: {
        january: 'януари',
        february: 'февруари',
        march: 'март',
        april: 'април',
        may: 'май',
        june: 'юни',
        july: 'юли',
        august: 'август',
        september: 'септември',
        october: 'октомври',
        november: 'ноември',
        december: 'декември'
      },
      myNameIs: 'Казвам се {#1}.',
      name: 'Име',
      required: 'Задължително',
      requiredField: 'Задължително поле',
      to: 'До',
      weekdays: {
        mo: 'пн',
        tu: 'вт',
        we: 'ср',
        th: 'чт',
        fr: 'пт',
        sa: 'сб',
        su: 'нд'
      }
    },
    label: 'Български'
  },
  EN: {
    data: {
      from: 'From',
      months: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
      },
      myNameIs: 'My name is {#1}.',
      name: 'Name',
      required: 'Required',
      requiredField: 'Required field',
      to: 'To',
      weekdays: {
        mo: 'Mon',
        tu: 'Tue',
        we: 'Wed',
        th: 'Thu',
        fr: 'Fri',
        sa: 'Sat',
        su: 'Sun'
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
