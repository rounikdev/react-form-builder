import { ChangeEvent, FocusEvent } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { InputOnBlurSideEffect } from '../types';

import { useTextInput } from '../useTextInput';

let mockUseField: jest.Mock;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let originalUseField: any;

jest.mock('@components/Form/useField', () => {
  const originalModule = jest.requireActual('@components/Form/useField');

  originalUseField = originalModule.useField;
  mockUseField = jest.fn((...args) => args);

  return {
    __esModule: true,
    ...originalModule,
    useField: mockUseField
  };
});

describe('useTextInput', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Calls `useField` with correct arguments', () => {
    const useFieldArgs = {
      dependencyExtractor: jest.fn(),
      formatter: jest.fn(),
      initialValue: 'vanilla',
      name: 'test',
      sideEffect: jest.fn(),
      validator: jest.fn()
    };

    renderHook(() => useTextInput(useFieldArgs));

    expect(mockUseField).toBeCalledTimes(1);
    expect(mockUseField.mock.calls[0][0]).toEqual(useFieldArgs);
  });

  it('Calls `useField` with undefined `initialValue`', () => {
    const useFieldArgs = {
      dependencyExtractor: jest.fn(),
      formatter: jest.fn(),
      name: 'test',
      sideEffect: jest.fn(),
      validator: jest.fn()
    };

    renderHook(() => useTextInput(useFieldArgs));

    expect(mockUseField).toBeCalledTimes(1);
    expect(mockUseField.mock.calls[0][0]).toEqual({ ...useFieldArgs, initialValue: '' });
  });

  it('Calls `onBlurSideEffect`', async () => {
    mockUseField.mockImplementation(originalUseField);

    const onBlurSideEffect: InputOnBlurSideEffect = ({ value, setValue }) => {
      const newValue = value ? `${value} test` : 'test';

      setValue && setValue(newValue);

      return newValue;
    };

    const useFieldArgs = {
      dependencyExtractor: jest.fn(),
      initialValue: '',
      name: 'test',
      onBlurSideEffect,
      sideEffect: jest.fn(),
      validator: jest.fn()
    };

    const { result } = renderHook(() => useTextInput(useFieldArgs));

    expect(result.current.value).toBe('test');

    act(() => {
      result.current.onBlurHandler(null as unknown as FocusEvent<HTMLElement, Element>);
    });

    await act(() => Promise.resolve());

    expect(result.current.value).toBe('test test');
  });

  it('Calls `onBlurSideEffect` with undefined `initialValue`', async () => {
    mockUseField.mockImplementation(originalUseField);

    const onBlurSideEffect: InputOnBlurSideEffect = ({ value, setValue }) => {
      const newValue = value ? `${value} test` : '';

      setValue && setValue(newValue);

      return newValue;
    };

    const useFieldArgs = {
      dependencyExtractor: jest.fn(),
      name: 'test',
      onBlurSideEffect,
      sideEffect: jest.fn(),
      validator: jest.fn()
    };

    const { result } = renderHook(() => useTextInput(useFieldArgs));

    expect(result.current.value).toBe('');

    act(() => {
      result.current.onChangeHandler('test');
    });

    act(() => {
      result.current.onBlurHandler(null as unknown as FocusEvent<HTMLElement, Element>);
    });

    await act(() => Promise.resolve());

    expect(result.current.value).toBe('test test');
  });
});
