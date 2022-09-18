import { act, renderHook } from '@testing-library/react-hooks';
import { ChangeEvent, FC, FocusEvent, MouseEvent } from 'react';

import { useMount } from '@rounik/react-custom-hooks';

import { testRender } from '@services/utils';

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

interface TestComponentProps {
  initialValue?: Date;
  name: string;
  openOnMount?: boolean;
}

const TestComponent: FC<TestComponentProps> = ({ initialValue, name, openOnMount }) => {
  const { context } = useDatepicker({ initialValue, name });

  useMount(() => {
    if (openOnMount) {
      context.toggle({ preventDefault: () => {} } as unknown as MouseEvent);
    }
  });

  return <div data-test="context-state">{JSON.stringify(context.state)}</div>;
};

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
      { date: today, expected: true, maxDate: undefined, minDate: undefined },
      { date: null, expected: false, maxDate: undefined, minDate: undefined },
      // With minDate:
      { date: today, expected: false, maxDate: undefined, minDate: afterHour },
      { date: today, expected: false, maxDate: undefined, minDate: tomorrow },
      { date: today, expected: false, maxDate: undefined, minDate: afterMonth },
      { date: today, expected: false, maxDate: undefined, minDate: afterYear },
      { date: tomorrow, expected: true, maxDate: undefined, minDate: today },
      // With maxDate:
      { date: afterHour, expected: false, maxDate: today, minDate: undefined },
      { date: tomorrow, expected: false, maxDate: today, minDate: undefined },
      { date: afterMonth, expected: false, maxDate: today, minDate: undefined },
      { date: afterYear, expected: false, maxDate: today, minDate: undefined },
      { date: today, expected: true, maxDate: afterHour, minDate: undefined },
      // With maxDate and minDate:
      { date: afterHour, expected: true, maxDate: tomorrow, minDate: today },
      { date: tomorrow, expected: true, maxDate: tomorrow, minDate: today },
      { date: tomorrow, expected: true, maxDate: afterMonth, minDate: today },
      { date: today, expected: false, maxDate: afterMonth, minDate: tomorrow }
    ];

    tests.forEach(({ date, expected, maxDate, minDate }) => {
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

  it("useDatepicker - selecting invalid date doesn't change the value", () => {
    const initialValue = new Date('1 Jan 2020');

    const maxDateExtractor = () => new Date('3 Jan 2020');

    const newValue = new Date('4 Jan 2020');

    const { result } = renderHook(() =>
      useDatepicker({ initialValue, maxDateExtractor, name: 'from' })
    );

    expect(result.current.context.dateInput).toBe('01/01/2020');

    act(() => {
      result.current.context.selectDate(newValue);
    });

    expect(result.current.context.dateInput).toBe('01/01/2020');
  });

  it('useDatepicker - inputChangeHandler', () => {
    const initialValue = new Date('1 Dec 2020');

    const { result } = renderHook(() => useDatepicker({ initialValue, name: 'from' }));

    expect(result.current.context.dateInput).toBe('01/12/2020');

    act(() => {
      result.current.context.inputChangeHandler({
        target: { value: '02/12/2020' }
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.context.dateInput).toBe('02/12/2020');
  });

  it('useDatepicker - calling toggle with initial value', () => {
    const initialValue = new Date('1 Dec 2020');

    const { result } = renderHook(() => useDatepicker({ initialValue, name: 'from' }));

    act(() => {
      result.current.context.toggle({ preventDefault: () => {} } as unknown as MouseEvent);
    });

    expect(result.current.context.state.month).toBe(11);
    expect(result.current.context.state.year).toBe(2020);
  });

  it('useDatepicker - calling toggle without initial value', () => {
    const now = new Date();

    const { result } = renderHook(() => useDatepicker({ initialValue: undefined, name: 'from' }));

    act(() => {
      result.current.context.toggle({ preventDefault: () => {} } as unknown as MouseEvent);
    });

    expect(result.current.context.state.month).toBe(now.getMonth());
    expect(result.current.context.state.year).toBe(now.getFullYear());
  });

  it('useDatepicker - calling toggle with maxDate and without initial value', () => {
    const maxDateExtractor = () => new Date('1 Jan 2020');

    const { result } = renderHook(() =>
      useDatepicker({ initialValue: undefined, maxDateExtractor, name: 'from' })
    );

    act(() => {
      result.current.context.toggle({ preventDefault: () => {} } as unknown as MouseEvent);
    });

    expect(result.current.context.state.month).toBe(0);
    expect(result.current.context.state.year).toBe(2020);
  });

  it('useDatepicker - calling toggle with minDate, maxDate and without initial value', () => {
    const maxDateExtractor = () => new Date('1 Jan 2020');
    const minDateExtractor = () => new Date('1 Dec 2019');

    const { result } = renderHook(() =>
      useDatepicker({ initialValue: undefined, maxDateExtractor, minDateExtractor, name: 'from' })
    );

    act(() => {
      result.current.context.toggle({ preventDefault: () => {} } as unknown as MouseEvent);
    });

    expect(result.current.context.state.month).toBe(11);
    expect(result.current.context.state.year).toBe(2019);
  });

  it('useDatepicker - calling toggle opens and closes', () => {
    const { result } = renderHook(() => useDatepicker({ initialValue: undefined, name: 'from' }));

    expect(result.current.context.state.show).toBe(null);

    act(() => {
      result.current.context.toggle({ preventDefault: () => {} } as unknown as MouseEvent);
    });

    expect(result.current.context.state.show).toBe(true);

    act(() => {
      result.current.context.toggle({ preventDefault: () => {} } as unknown as MouseEvent);
    });

    expect(result.current.context.state.show).toBe(false);
  });

  it('useDatepicker - calling hide closes', () => {
    const { result } = renderHook(() => useDatepicker({ initialValue: undefined, name: 'from' }));

    expect(result.current.context.state.show).toBe(null);

    act(() => {
      result.current.context.toggle({ preventDefault: () => {} } as unknown as MouseEvent);
    });

    expect(result.current.context.state.show).toBe(true);

    act(() => {
      result.current.context.hide();
    });

    expect(result.current.context.state.show).toBe(false);

    // Calling it for the second time
    // has same result:
    act(() => {
      result.current.context.hide();
    });

    expect(result.current.context.state.show).toBe(false);
  });

  it('useDatepicker - can set focused date', () => {
    const currentTimestamp = `${new Date().getTime()}`;

    const { result } = renderHook(() => useDatepicker({ initialValue: undefined, name: 'from' }));

    expect(result.current.context.state.focusedDate).toBe('');

    act(() => {
      result.current.context.setFocusedDate(currentTimestamp);
    });

    expect(result.current.context.state.focusedDate).toBe(currentTimestamp);
  });

  it('useDatepicker - calling inputBlurHandler with valid input value and no min/max date', () => {
    const dateInput = '01/01/2020';

    const { result } = renderHook(() => useDatepicker({ initialValue: undefined, name: 'from' }));

    const blurEvent = { target: { value: dateInput } };

    act(() => {
      result.current.context.inputBlurHandler(blurEvent as unknown as FocusEvent<HTMLInputElement>);
    });

    expect(result.current.context.dateInput).toBe(dateInput);
  });

  it('useDatepicker - calling inputBlurHandler with invalid input value', () => {
    const dateInput = '01012020';

    const { result } = renderHook(() => useDatepicker({ initialValue: undefined, name: 'from' }));

    const blurEvent = { target: { value: dateInput } };

    act(() => {
      result.current.context.inputBlurHandler(blurEvent as unknown as FocusEvent<HTMLInputElement>);
    });

    expect(result.current.context.dateInput).toBe('');
  });

  it('useDatepicker - calling inputBlurHandler with non-selectable valid input value', () => {
    const dateInput = '02/01/2020';
    const maxDateExtractor = () => new Date('1 Jan 2020');

    const { result } = renderHook(() =>
      useDatepicker({ initialValue: undefined, maxDateExtractor, name: 'from' })
    );

    const blurEvent = { target: { value: dateInput } };

    act(() => {
      result.current.context.inputBlurHandler(blurEvent as unknown as FocusEvent<HTMLInputElement>);
    });

    expect(result.current.context.dateInput).toBe('');
  });

  it('useDatepicker - handle keyup events on the document', () => {
    const map: { [key: string]: EventListenerOrEventListenerObject } = {};

    document.addEventListener = jest.fn((e, cb) => {
      map[e] = cb;
    });

    const keyup = (code: string) => {
      act(() => {
        (map.keyup as EventListener)({ code } as unknown as Event);
      });
    };

    const initialValue = new Date('2 Jan 2020');

    const { getByDataTest } = testRender(
      <TestComponent initialValue={initialValue} name="from" openOnMount />
    );

    const focusedDateShouldBe = (expected: string) => {
      const state = JSON.parse(getByDataTest('context-state').textContent ?? '');
      expect(state.focusedDate).toBe(expected);
    };

    keyup('Tab');
    focusedDateShouldBe('');

    keyup('ArrowRight');
    // Because state.focusedDate is ''
    // Here we set the focusedDate to the
    // first date in the calendar:
    focusedDateShouldBe(`${new Date('30 Dec 2019').getTime()}`);

    keyup('ArrowRight');
    focusedDateShouldBe(`${new Date('31 Dec 2019').getTime()}`);

    keyup('ArrowLeft');
    focusedDateShouldBe(`${new Date('30 Dec 2019').getTime()}`);

    keyup('ArrowLeft');
    focusedDateShouldBe(`${new Date('29 Dec 2019').getTime()}`);

    keyup('ArrowDown');
    focusedDateShouldBe(`${new Date('5 Jan 2020').getTime()}`);

    keyup('ArrowRight');
    focusedDateShouldBe(`${new Date('6 Jan 2020').getTime()}`);

    keyup('ArrowUp');
    focusedDateShouldBe(`${new Date('30 Dec 2019').getTime()}`);

    keyup('ArrowUp');
    focusedDateShouldBe(`${new Date('23 Dec 2019').getTime()}`);

    keyup('ArrowDown');
    focusedDateShouldBe(`${new Date('30 Dec 2019').getTime()}`);

    keyup('ArrowDown');
    focusedDateShouldBe(`${new Date('6 Jan 2020').getTime()}`);

    keyup('Escape');

    let state = JSON.parse(getByDataTest('context-state').textContent ?? '');
    expect(state.focusedDate).toBe('');

    expect(state.show).toBe(false);

    // Shouldn't change focused
    // if not shown:
    keyup('ArrowLeft');

    state = JSON.parse(getByDataTest('context-state').textContent ?? '');
    expect(state.focusedDate).toBe('');

    expect(state.show).toBe(false);
  });
});
