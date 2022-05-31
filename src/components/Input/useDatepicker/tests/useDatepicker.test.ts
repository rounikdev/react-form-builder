import { act, renderHook } from '@testing-library/react-hooks';

import { monthNames } from '../constants';
import {
  areSameDay,
  canBeSelected,
  constructWeeksInMonth,
  formatDateInput,
  getDaysInMonth,
  validateDateInput
} from '../helpers';
import { useDatepicker } from '../useDatepicker';

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

  it('useDatepicker - with initial value', () => {
    const initialValue = new Date('1 Jan 2020');
    const name = 'from';

    const { result } = renderHook(() => useDatepicker({ initialValue, name }));

    expect(result.current.context.value).toEqual(initialValue);
    expect(result.current.context.dateInput).toBe('01/01/2020');
  });

  it('useDatepicker - with no initial value', () => {
    const initialValue = undefined;
    const name = 'from';

    const { result } = renderHook(() => useDatepicker({ initialValue, name }));

    expect(result.current.context.value).toEqual(undefined);
    expect(result.current.context.dateInput).toBe('');
  });

  it('useDatepicker - with wrong initial value and minDate', () => {
    const initialValue = new Date('1 Jan 2020');
    const minDateExtractor = () => new Date('2 Jan 2020');
    const name = 'from';

    const { result } = renderHook(() => useDatepicker({ initialValue, minDateExtractor, name }));

    expect(result.current.context.value).toEqual(undefined);
    expect(result.current.context.dateInput).toBe('');
  });

  it('useDatepicker - with right initial value and minDate', () => {
    const initialValue = new Date('3 Jan 2020');
    const minDateExtractor = () => new Date('2 Jan 2020');
    const name = 'from';

    const { result } = renderHook(() => useDatepicker({ initialValue, minDateExtractor, name }));

    expect(result.current.context.value).toEqual(initialValue);
    expect(result.current.context.dateInput).toBe('03/01/2020');
  });

  it('useDatepicker - with wrong initial value and maxDate', () => {
    const initialValue = new Date('2 Jan 2020');
    const maxDateExtractor = () => new Date('1 Jan 2020');
    const name = 'from';

    const { result } = renderHook(() => useDatepicker({ initialValue, maxDateExtractor, name }));

    expect(result.current.context.value).toEqual(undefined);
    expect(result.current.context.dateInput).toBe('');
  });

  it('useDatepicker - with right initial value and maxDate', () => {
    const initialValue = new Date('1 Jan 2020');
    const maxDateExtractor = () => new Date('2 Jan 2020');
    const name = 'from';

    const { result } = renderHook(() => useDatepicker({ initialValue, maxDateExtractor, name }));

    expect(result.current.context.value).toEqual(initialValue);
    expect(result.current.context.dateInput).toBe('01/01/2020');
  });

  it('useDatepicker - with right initial value and maxDate and minDate', () => {
    const initialValue = new Date('2 Jan 2020');
    const maxDateExtractor = () => new Date('3 Jan 2020');
    const minDateExtractor = () => new Date('1 Jan 2020');
    const name = 'from';

    const { result } = renderHook(() =>
      useDatepicker({ initialValue, maxDateExtractor, minDateExtractor, name })
    );

    expect(result.current.context.value).toEqual(initialValue);
    expect(result.current.context.dateInput).toBe('02/01/2020');
  });

  it('useDatepicker - change month', () => {
    const initialValue = new Date('1 Dec 2020');

    const previousMonthName = monthNames[10];
    const monthName = monthNames[11];
    const nextMonthName = monthNames[0];

    const { result } = renderHook(() => useDatepicker({ initialValue, name: 'from' }));

    expect(result.current.context.monthName).toEqual(monthName);
    expect(result.current.context.state.year).toBe(2020);

    act(() => {
      result.current.context.changeMonth(1);
    });

    expect(result.current.context.monthName).toEqual(nextMonthName);
    expect(result.current.context.state.year).toBe(2021);

    act(() => {
      result.current.context.changeMonth(-1);
    });

    expect(result.current.context.monthName).toEqual(monthName);
    expect(result.current.context.state.year).toBe(2020);

    act(() => {
      result.current.context.changeMonth(-1);
    });

    expect(result.current.context.monthName).toEqual(previousMonthName);
    expect(result.current.context.state.year).toBe(2020);
  });

  it('useDatepicker - change year', () => {
    const initialValue = new Date('1 Dec 2020');

    const { result } = renderHook(() => useDatepicker({ initialValue, name: 'from' }));

    expect(result.current.context.state.year).toBe(2020);

    act(() => {
      result.current.context.changeYear(1);
    });

    expect(result.current.context.state.year).toBe(2021);

    act(() => {
      result.current.context.changeYear(-1);
    });

    expect(result.current.context.state.year).toBe(2020);
  });

  it('useDatepicker - select valid date', () => {
    const initialValue = new Date('1 Dec 2020');
    const newValue = new Date('3 Jun 2021');

    const { result } = renderHook(() => useDatepicker({ initialValue, name: 'from' }));

    expect(result.current.context.dateInput).toBe('01/12/2020');

    act(() => {
      result.current.context.selectDate(newValue);
    });

    expect(result.current.context.dateInput).toBe('03/06/2021');
  });
});
