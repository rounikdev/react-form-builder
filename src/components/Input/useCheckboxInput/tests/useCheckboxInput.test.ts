/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react-hooks';

import { useCheckboxInput } from '../useCheckboxInput';

let mockUseField: jest.Mock;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let originalUseField: any;

jest.mock('@components/Form/hooks/useField/useField', () => {
  const originalModule = jest.requireActual('@components/Form/hooks/useField/useField');

  originalUseField = originalModule.useField;
  mockUseField = jest.fn((...args) => args);

  return {
    __esModule: true,
    ...originalModule,
    useField: mockUseField
  };
});

describe('useCheckboxInput', () => {
  beforeEach(() => {
    mockUseField.mockImplementation(jest.fn((...args) => args));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Calls `useField` with correct arguments', () => {
    const useFieldArg = {
      dependencyExtractor: jest.fn(),
      initialValue: true,
      name: 'test',
      sideEffect: jest.fn(),
      validator: jest.fn()
    };

    renderHook(() => useCheckboxInput(useFieldArg));

    expect(mockUseField).toBeCalledTimes(1);
    expect(mockUseField.mock.calls[0][0]).toEqual(useFieldArg);
  });

  it('Returns correct props', async () => {
    mockUseField.mockImplementation(originalUseField);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const returnPropTypes: { [key: string]: any } = {
      fieldRef: 'object',
      onBlurHandler: 'function',
      onChangeHandler: 'function',
      onFocusHandler: 'function',
      errors: 'object',
      focused: 'boolean',
      touched: 'boolean',
      valid: 'boolean',
      validating: 'boolean',
      value: 'boolean'
    };

    const useCheckboxInputArgs = {
      dependencyExtractor: jest.fn(),
      initialValue: true,
      name: 'test',
      sideEffect: jest.fn(),
      validator: jest.fn()
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { result }: { result: { [key: string]: any } } = renderHook(() =>
      useCheckboxInput(useCheckboxInputArgs)
    );

    await act(() => Promise.resolve());

    expect(Object.keys(returnPropTypes).length === Object.keys(result.current).length).toBeTruthy();

    Object.keys(returnPropTypes).forEach((key) =>
      expect(typeof result.current[key]).toBe(returnPropTypes[key])
    );
  });
});
