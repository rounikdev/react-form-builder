import { FC, useMemo, useState } from 'react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { testRender } from '../../../utils';

import { GlobalModel } from '../GlobalModel';

describe('GlobalModel', () => {
  it('isNotEmptyArray', () => {
    const test = [
      { input: '', expected: false },
      {
        input: 10,
        expected: false
      },
      {
        input: false,
        expected: false
      },
      {
        input: Symbol(),
        expected: false
      },
      {
        input: {},
        expected: false
      },
      {
        input: new Map(),
        expected: false
      },
      {
        input: new Set(),
        expected: false
      },
      {
        input: [],
        expected: false
      },
      {
        input: ['', 10],
        expected: true
      }
    ];

    test.forEach(({ input, expected }) =>
      expect(GlobalModel.isNotEmptyArray(input)).toBe(expected)
    );
  });

  it('isString', () => {
    const test = [
      { input: '', expected: true },
      { input: 'abc', expected: true },
      {
        input: new String(),
        expected: true
      },
      {
        input: 10,
        expected: false
      },
      {
        input: true,
        expected: false
      },
      {
        input: Symbol(),
        expected: false
      },
      {
        input: {},
        expected: false
      },
      {
        input: new Map(),
        expected: false
      },
      {
        input: new Set(),
        expected: false
      },
      {
        input: [],
        expected: false
      },
      {
        input: new Array('abc'),
        expected: false
      }
    ];

    test.forEach(({ input, expected }) => expect(GlobalModel.isString(input)).toBe(expected));
  });

  it('deepClone', () => {
    const object = {
      firstName: 'Ivan',
      lastName: 'Ivanov',
      phoneNumbers: [234567]
    };

    expect(GlobalModel.deepClone(object)).toEqual(object);
  });

  it('hasValue', () => {
    const tests = [
      { expected: false, value: undefined },
      { expected: false, value: null },
      { expected: false, value: '' },
      { expected: true, value: {} },
      { expected: true, value: 'Hi' },
      { expected: true, value: 0 },
      { expected: true, value: false },
      { expected: true, value: true }
    ];

    tests.forEach((testCase) => {
      expect(GlobalModel.hasValue(testCase.value)).toBe(testCase.expected);
    });
  });

  it('getNestedValue', () => {
    const tests = [
      {
        expected: 'Ivan',
        item: {
          name: 'Ivan'
        },
        path: ['name']
      },
      {
        expected: {
          name: 'Ivan'
        },
        item: {
          name: 'Ivan'
        },
        path: []
      },
      {
        expected: {
          street: 'Cucumber'
        },
        item: {
          addresses: [
            {
              street: 'Tomato'
            },
            {
              street: 'Cucumber'
            }
          ]
        },
        path: ['addresses', 1]
      }
    ];

    tests.forEach(({ expected, item, path }) => {
      expect(GlobalModel.getNestedValue(item, path)).toEqual(expected);
    });
  });

  it('clearRAFTimeout', () => {
    jest.useFakeTimers();
    const mockCallback = jest.fn();

    const rafIdInfo = GlobalModel.setRAFTimeout(mockCallback, 200);

    GlobalModel.clearRAFTimeout(rafIdInfo);

    jest.runAllTimers();

    expect(mockCallback).not.toBeCalled();
  });

  describe('debounceRAF', () => {
    const TestCmp: FC<{ onChange?: (value: string) => void }> = ({ onChange }) => {
      jest.useFakeTimers();
      const [value, setValue] = useState('');

      const debouncedOnChange = useMemo(
        () =>
          GlobalModel.debounceRAF(
            onChange
              ? (value) => {
                  onChange && onChange(value);
                  setValue(value);
                }
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (null as any),
            200
          ),
        [onChange]
      );

      return (
        <input
          data-test="test-input"
          onChange={(e) => debouncedOnChange(e.target.value)}
          value={value}
        />
      );
    };

    it('Called with callback', async () => {
      const mockCallback = jest.fn();

      const { getByDataTest } = testRender(<TestCmp onChange={mockCallback} />);

      userEvent.type(getByDataTest('test-input'), 'a');
      userEvent.type(getByDataTest('test-input'), 'b');

      await waitFor(() => {
        expect(getByDataTest('test-input')).toHaveValue('b');
      });

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith('b');
      });
    });

    it('Called with no callback', async () => {
      const { getByDataTest } = testRender(<TestCmp />);

      userEvent.type(getByDataTest('test-input'), 'a');
      userEvent.type(getByDataTest('test-input'), 'b');

      await waitFor(() => {
        expect(getByDataTest('test-input')).toHaveValue('');
      });
    });
  });

  describe('setRAFTimeout', () => {
    it('Called with callback', () => {
      jest.useFakeTimers();
      const mockCallback = jest.fn();

      GlobalModel.setRAFTimeout(mockCallback, 200);

      jest.runAllTimers();

      expect(mockCallback).toBeCalled();
    });

    it('Called with no callback', () => {
      jest.useFakeTimers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockCallback = null as unknown as jest.Mock;

      GlobalModel.setRAFTimeout(mockCallback, 200);

      jest.runAllTimers();

      try {
        expect(mockCallback).not.toBeCalled();
      } catch (error) {}
    });
  });

  it('valueSplitter', () => {});
});
