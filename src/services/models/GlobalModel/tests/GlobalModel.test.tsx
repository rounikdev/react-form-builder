import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FC, useMemo, useState } from 'react';

import { testRender } from '@services/utils';

import { GlobalModel } from '../GlobalModel';

describe('GlobalModel', () => {
  it('isNotEmptyArray', () => {
    const test = [
      { expected: false, input: '' },
      {
        expected: false,
        input: 10
      },
      {
        expected: false,
        input: false
      },
      {
        expected: false,
        input: Symbol()
      },
      {
        expected: false,
        input: {}
      },
      {
        expected: false,
        input: new Map()
      },
      {
        expected: false,
        input: new Set()
      },
      {
        expected: false,
        input: []
      },
      {
        expected: true,
        input: ['', 10]
      }
    ];

    test.forEach(({ expected, input }) =>
      expect(GlobalModel.isNotEmptyArray(input)).toBe(expected)
    );
  });

  it('isString', () => {
    const test = [
      { expected: true, input: '' },
      { expected: true, input: 'abc' },
      {
        expected: true,
        input: new String()
      },
      {
        expected: false,
        input: 10
      },
      {
        expected: false,
        input: true
      },
      {
        expected: false,
        input: Symbol()
      },
      {
        expected: false,
        input: {}
      },
      {
        expected: false,
        input: new Map()
      },
      {
        expected: false,
        input: new Set()
      },
      {
        expected: false,
        input: []
      },
      {
        expected: false,
        input: new Array('abc')
      }
    ];

    test.forEach(({ expected, input }) => expect(GlobalModel.isString(input)).toBe(expected));
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
              ? (newValue) => {
                  if (onChange) {
                    onChange(newValue);
                  }

                  setValue(newValue);
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

  it('valueSplitter', () => {
    const pattern = '** | ** | **';
    const patternDelimiter = ' | ';

    const tests = [
      {
        expected: 'ab | cd | ef',
        goForward: true,
        value: 'abcdef'
      },
      {
        expected: 'ab | cd | e',
        goForward: false,
        value: 'abcde'
      }
    ];

    tests.forEach(({ expected, goForward, value }) =>
      expect(GlobalModel.valueSplitter({ goForward, pattern, patternDelimiter, value })).toBe(
        expected
      )
    );
  });

  it('removeNonDigitFromNegativeString', () => {
    const tests = [
      {
        expected: '-13',
        value: '-1a3'
      },
      {
        expected: '-13',
        value: 'a-13.-r'
      }
    ];

    tests.forEach(({ expected, value }) =>
      expect(GlobalModel.removeNonDigitFromNegativeString(value)).toBe(expected)
    );
  });

  it('removeNonDigitFromString', () => {
    const tests = [
      {
        expected: '13',
        value: '-1a3'
      },
      {
        expected: '13',
        value: 'a-13.-r'
      }
    ];

    tests.forEach(({ expected, value }) =>
      expect(GlobalModel.removeNonDigitFromString(value)).toBe(expected)
    );
  });

  it('classer', () => {
    const tests = [
      {
        expected: 'Class',
        value: [false, undefined, 'Class']
      },
      {
        expected: 'ClassOne ClassTwo',
        value: ['ClassOne', 'ClassTwo']
      }
    ];

    tests.forEach(({ expected, value }) => expect(GlobalModel.classer(value)).toBe(expected));
  });

  it('executeOnNextPaint', () => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(((cb) => cb(0)) as (callback: FrameRequestCallback) => number);

    const mockCb = jest.fn();

    GlobalModel.executeOnNextPaint(mockCb);

    expect(mockCb).toHaveBeenCalled();
  });

  it('createStableDependency', () => {
    const tests = [
      {
        expected: JSON.stringify([1, 2, 3]),
        value: [1, 2, 3]
      },
      {
        expected: BigInt(1),
        value: BigInt(1)
      }
    ];

    tests.forEach(({ expected, value }) =>
      expect(GlobalModel.createStableDependency(value)).toBe(expected)
    );
  });
});
