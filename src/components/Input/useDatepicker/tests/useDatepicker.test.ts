import {
  areSameDay,
  canBeSelected,
  constructWeeksInMonth,
  formatDateInput,
  getDaysInMonth,
  validateDateInput
} from '../helpers';

const today = new Date('1 Jan 2022');

const afterHour = new Date(today);
afterHour.setHours(today.getHours() + 1);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const afterMonth = new Date(today);
afterMonth.setMonth(today.getMonth() + 1);

const afterYear = new Date(today);
afterYear.setFullYear(today.getFullYear() + 1);

describe('useDatepicker', () => {
  it('helpers - areSameDay', () => {
    const tests = [
      { dayA: today, dayB: today, expected: true },
      { dayA: today, dayB: afterHour, expected: true },
      { dayA: today, dayB: tomorrow, expected: false },
      { dayA: today, dayB: afterMonth, expected: false },
      { dayA: today, dayB: afterYear, expected: false }
    ];

    tests.forEach(({ dayA, dayB, expected }) => {
      expect(areSameDay(dayA, dayB)).toBe(expected);
    });
  });

  it('helpers - canBeSelected', () => {
    const tests = [
      // No maxDate or minDate:
      { date: today, maxDate: undefined, minDate: undefined, expected: true },
      { date: null, maxDate: undefined, minDate: undefined, expected: false },
      // With minDate:
      { date: today, maxDate: undefined, minDate: afterHour, expected: false },
      { date: today, maxDate: undefined, minDate: tomorrow, expected: false },
      { date: today, maxDate: undefined, minDate: afterMonth, expected: false },
      { date: today, maxDate: undefined, minDate: afterYear, expected: false },
      { date: tomorrow, maxDate: undefined, minDate: today, expected: true },
      // With maxDate:
      { date: afterHour, maxDate: today, minDate: undefined, expected: false },
      { date: tomorrow, maxDate: today, minDate: undefined, expected: false },
      { date: afterMonth, maxDate: today, minDate: undefined, expected: false },
      { date: afterYear, maxDate: today, minDate: undefined, expected: false },
      { date: today, maxDate: afterHour, minDate: undefined, expected: true },
      // With maxDate and minDate:
      { date: afterHour, maxDate: tomorrow, minDate: today, expected: true },
      { date: tomorrow, maxDate: tomorrow, minDate: today, expected: true },
      { date: tomorrow, maxDate: afterMonth, minDate: today, expected: true },
      { date: today, maxDate: afterMonth, minDate: tomorrow, expected: false }
    ];

    tests.forEach(({ date, maxDate, minDate, expected }) => {
      expect(canBeSelected({ date, maxDate, minDate })).toBe(expected);
    });
  });

  it('helpers - constructWeeksInMonth', () => {
    const tests = [
      {
        expected: {
          firstElement: new Date('27 Jan 2020'),
          lastElement: new Date('1 Mar 2020'),
          length: 5
        },
        month: 1,
        useEndOfDay: false,
        year: 2020
      },
      {
        expected: {
          firstElement: new Date('24 Feb 2020'),
          lastElement: new Date('5 Apr 2020'),
          length: 6
        },
        month: 2,
        useEndOfDay: false,
        year: 2020
      },
      {
        expected: {
          firstElement: new Date('1 Feb 2021'),
          lastElement: new Date('28 Feb 2021'),
          length: 4
        },
        month: 1,
        useEndOfDay: false,
        year: 2021
      }
    ];

    tests.forEach(
      ({ expected: { firstElement, lastElement, length }, month, useEndOfDay, year }) => {
        const days = getDaysInMonth({ month, useEndOfDay, year });

        const weeks = constructWeeksInMonth(days);

        expect(weeks.length).toBe(length);
        expect(weeks[0][0]).toEqual(firstElement);
        expect(weeks[weeks.length - 1][6]).toEqual(lastElement);
      }
    );
  });

  it('helpers - formatDateInput', () => {
    const tests = [
      { date: new Date('1 Jan 2022'), expected: '01/01/2022' },
      { date: new Date('1 Oct 2022'), expected: '01/10/2022' },
      { date: new Date('10 Oct 2022'), expected: '10/10/2022' },
      { date: new Date('10 Jan 2022'), expected: '10/01/2022' },
      { date: null, expected: '' }
    ];

    tests.forEach(({ date, expected }) => {
      expect(formatDateInput(date)).toBe(expected);
    });
  });

  it('helpers - getDaysInMonth', () => {
    const tests = [
      {
        expected: {
          firstElement: new Date('1 Feb 2020'),
          lastElement: new Date('29 Feb 2020'),
          length: 29
        },
        month: 1,
        useEndOfDay: false,
        year: 2020
      },
      {
        expected: {
          firstElement: new Date('1 Feb 2022'),
          lastElement: new Date('28 Feb 2022'),
          length: 28
        },
        month: 1,
        useEndOfDay: false,
        year: 2022
      },
      {
        expected: {
          firstElement: new Date('1 Feb 2022 23:59:59'),
          lastElement: new Date('28 Feb 2022 23:59:59'),
          length: 28
        },
        month: 1,
        useEndOfDay: true,
        year: 2022
      }
    ];

    tests.forEach(
      ({ expected: { firstElement, lastElement, length }, month, useEndOfDay, year }) => {
        const days = getDaysInMonth({ month, useEndOfDay, year });

        expect(days.length).toBe(length);
        expect(days[0]).toEqual(firstElement);
        expect(days[days.length - 1]).toEqual(lastElement);
      }
    );
  });

  it('helpers - validateDateInput', () => {
    const tests = [
      {
        dateString: '',
        expected: null,
        useEndOfDay: false
      },
      {
        dateString: 'abcd',
        expected: null,
        useEndOfDay: false
      },
      {
        dateString: '32/01/2022',
        expected: null,
        useEndOfDay: false
      },
      {
        dateString: '01/13/2022',
        expected: null,
        useEndOfDay: false
      },
      {
        dateString: '01/01/999',
        expected: null,
        useEndOfDay: false
      },
      {
        dateString: '01/01/3001',
        expected: null,
        useEndOfDay: false
      },
      {
        dateString: '01/01/2022',
        expected: new Date('1 Jan 2022'),
        useEndOfDay: false
      },
      {
        dateString: '29/02/2020',
        expected: new Date('29 Feb 2020'),
        useEndOfDay: false
      },
      {
        dateString: '01/01/2022',
        expected: new Date('1 Jan 2022 23:59:59'),
        useEndOfDay: true
      },
      {
        dateString: '29/02/2020',
        expected: new Date('29 Feb 2020 23:59:59'),
        useEndOfDay: true
      }
    ];

    tests.forEach(({ dateString, expected, useEndOfDay }) => {
      expect(validateDateInput({ dateString, useEndOfDay })).toEqual(expected);
    });
  });
});
