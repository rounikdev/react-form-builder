/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react-hooks';

import { useCheckboxInput } from '../useCheckboxInput';

let mockUseField: jest.Mock;

jest.mock('@components/Form/useField', () => {
  const originalModule = jest.requireActual('@components/Form/useField');

  mockUseField = jest.fn((...args) => args);

  return {
    __esModule: true,
    ...originalModule,
    useField: mockUseField
  };
});

describe('useCheckboxInput', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Calls `useField` with correct arguments', () => {
    const mockDependencyExtractor = jest.fn();
    const mockSideEffect = jest.fn();
    const mocValidator = jest.fn();

    const useFieldArg = {
      dependencyExtractor: mockDependencyExtractor,
      initialValue: true,
      name: 'test',
      sideEffect: mockSideEffect,
      validator: mocValidator
    };

    renderHook(() => useCheckboxInput(useFieldArg));

    expect(mockUseField).toBeCalledTimes(1);
    expect(mockUseField.mock.calls[0][0]).toEqual(useFieldArg);
  });
});
