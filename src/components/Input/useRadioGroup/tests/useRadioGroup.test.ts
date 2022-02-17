import { act, renderHook } from '@testing-library/react-hooks';

import { useRadioGroup } from '../useRadioGroup';

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

describe('useRadioGroup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Calls `useField` with correct arguments', () => {
    const useFieldArgs = {
      dependencyExtractor: jest.fn(),
      initialValue: 'vanilla',
      name: 'test',
      sideEffect: jest.fn(),
      validator: jest.fn()
    };

    const useRadioGroupArgs = {
      ...useFieldArgs,
      options: [
        {
          value: 'chocolate',
          label: 'Chocolate'
        },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]
    };

    renderHook(() => useRadioGroup(useRadioGroupArgs));

    expect(mockUseField).toBeCalledTimes(1);
    expect(mockUseField.mock.calls[0][0]).toEqual(useFieldArgs);
  });

  it('Returns correct props', async () => {
    mockUseField.mockImplementation(originalUseField);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const returnPropTypes: { [key: string]: any } = {
      fieldRef: 'object',
      onBlurHandler: 'function',
      onChangeHandler: 'function',
      onFocusHandler: 'function',
      enhancedOptions: 'object',
      errors: 'object',
      focused: 'boolean',
      touched: 'boolean',
      valid: 'boolean',
      validating: 'boolean',
      value: 'string'
    };

    const useRadioGroupArgs = {
      dependencyExtractor: jest.fn(),
      initialValue: 'vanilla',
      name: 'test',
      options: [
        {
          value: 'chocolate',
          label: 'Chocolate'
        },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ],
      sideEffect: jest.fn(),
      validator: jest.fn()
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { result }: { result: { [key: string]: any } } = renderHook(() =>
      useRadioGroup(useRadioGroupArgs)
    );

    await act(() => Promise.resolve());

    expect(Object.keys(returnPropTypes).length === Object.keys(result.current).length).toBeTruthy();

    Object.keys(returnPropTypes).forEach((key) =>
      expect(typeof result.current[key]).toBe(returnPropTypes[key])
    );
  });

  it('Creates correct `enhancedOptions`', async () => {
    mockUseField.mockImplementation(originalUseField);

    const useFieldArgs = {
      dependencyExtractor: jest.fn(),
      initialValue: 'vanilla',
      name: 'test',
      sideEffect: jest.fn(),
      validator: jest.fn()
    };

    const useRadioGroupArgs = {
      ...useFieldArgs,
      options: [
        {
          value: 'chocolate',
          label: 'Chocolate'
        },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]
    };

    const { result } = renderHook(() => useRadioGroup(useRadioGroupArgs));

    act(() => {
      result.current.enhancedOptions[0].onChangeHandler();
    });

    await act(() => Promise.resolve());

    const enhancedOptionOne = result.current.enhancedOptions[0];

    expect(enhancedOptionOne.checked).toBe(true);
    expect(enhancedOptionOne.inputValue).toBe('chocolate');
    expect(enhancedOptionOne.label).toBe('Chocolate');
    expect(enhancedOptionOne.title).toBe('Chocolate');
    expect(enhancedOptionOne.value).toBe('chocolate');
  });
});
