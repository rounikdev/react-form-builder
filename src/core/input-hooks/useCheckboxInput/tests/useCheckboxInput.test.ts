/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react-hooks';

import { useField } from '@core/Form/hooks/useField/useField';

import { useCheckboxInput } from '../useCheckboxInput';

jest.mock('@core/Form/hooks/useField/useField', () => {
  const originalModule = jest.requireActual('@core/Form/hooks/useField/useField');

  return {
    __esModule: true,
    ...originalModule,
    useField: jest.fn((...args) => args)
  };
});

describe('useCheckboxInput', () => {
  beforeEach(() => {
    (useField as jest.Mock).mockImplementation(jest.fn((...args) => args));
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

    expect(useField).toBeCalledTimes(1);
    expect((useField as jest.Mock).mock.calls[0][0]).toEqual(useFieldArg);
  });

  it('Returns correct props', async () => {
    (useField as jest.Mock).mockImplementation(
      jest.requireActual('@core/Form/hooks/useField/useField').useField
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const returnPropTypes: { [key: string]: any } = {
      errors: 'object',
      fieldRef: 'object',
      focused: 'boolean',
      isEdit: 'boolean',
      isRequired: 'boolean',
      onBlurHandler: 'function',
      onChangeHandler: 'function',
      onFocusHandler: 'function',
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
