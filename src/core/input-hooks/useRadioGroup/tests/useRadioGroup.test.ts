import { act, renderHook } from '@testing-library/react-hooks';

import { useField } from '@core/Form/hooks/useField/useField';

import { useRadioGroup } from '../useRadioGroup';

jest.mock('@core/Form/hooks/useField/useField', () => {
  const originalModule = jest.requireActual('@core/Form/hooks/useField/useField');

  return {
    __esModule: true,
    ...originalModule,
    useField: jest.fn((...args) => args)
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
          label: 'Chocolate',
          value: 'chocolate'
        },
        { label: 'Strawberry', value: 'strawberry' },
        { label: 'Vanilla', value: 'vanilla' }
      ]
    };

    renderHook(() => useRadioGroup(useRadioGroupArgs));

    expect(useField).toBeCalledTimes(1);
    expect((useField as jest.Mock).mock.calls[0][0]).toEqual(useFieldArgs);
  });

  it('Returns correct props', async () => {
    (useField as jest.Mock).mockImplementation(
      jest.requireActual('@core/Form/hooks/useField/useField').useField
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const returnPropTypes: { [key: string]: any } = {
      enhancedOptions: 'object',
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
      value: 'string'
    };

    const useRadioGroupArgs = {
      dependencyExtractor: jest.fn(),
      initialValue: 'vanilla',
      name: 'test',
      options: [
        {
          label: 'Chocolate',
          value: 'chocolate'
        },
        { label: 'Strawberry', value: 'strawberry' },
        { label: 'Vanilla', value: 'vanilla' }
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
    (useField as jest.Mock).mockImplementation(
      jest.requireActual('@core/Form/hooks/useField/useField').useField
    );

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
          label: 'Chocolate',
          value: 'chocolate'
        },
        { label: 'Strawberry', value: 'strawberry' },
        { label: 'Vanilla', value: 'vanilla' }
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
