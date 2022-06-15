import { FC, ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { useMount } from '@rounik/react-custom-hooks';

import { FormRoot } from '@core/Form/components';
import { INITIAL_RESET_RECORD_KEY, ROOT_RESET_RECORD_KEY } from '@core/Form/constants';
import { useFormRoot } from '@core/Form/providers';
import { FormStateEntryValue } from '@core/Form/types';

import { useFormArray } from '../useFormArray';

interface ResetProps {
  resetKey: string;
  resetState: FormStateEntryValue;
}

const Reset: FC<ResetProps> = ({ resetKey, resetState }) => {
  const {
    methods: { setResetFlag, setResetRecords }
  } = useFormRoot();

  useMount(() => {
    setResetRecords((currentResetRecords) => {
      return {
        ...currentResetRecords,
        [resetKey]: resetState
      };
    });
  });

  useMount(() => {
    setTimeout(() => {
      setResetFlag({ resetKey });
    });
  });

  return null;
};

const Wrapper: FC = ({ children }) => <FormRoot dataTest="root-form">{children}</FormRoot>;

interface WrapperWithResetProps {
  children?: ReactNode;
  resetKey: string;
  resetState: FormStateEntryValue;
}
const WrapperWithReset: FC<WrapperWithResetProps> = ({ children, resetKey, resetState }) => (
  <FormRoot dataTest="root-form">
    <Reset resetKey={resetKey} resetState={resetState} />
    {children}
  </FormRoot>
);

interface User {
  firstName: string;
  id: string;
  lastName: string;
}

const initialValue: User[] = [{ firstName: 'Ivan', id: '1', lastName: 'Ivanov' }];

const factory = () => ({ firstName: '', id: '2', lastName: '' });

describe('useFormArray', () => {
  it('Provides list, add and remove methods', () => {
    const { result } = renderHook(() => useFormArray({ factory, fieldId: 'users', initialValue }), {
      wrapper: Wrapper
    });

    expect(typeof result.current.add).toBe('function');

    expect(typeof result.current.remove).toBe('function');

    expect(result.current.list).toEqual(initialValue);
  });

  it('Provides default value if no list is provided', () => {
    const { result } = renderHook(
      () => useFormArray({ factory, fieldId: 'users', initialValue: undefined }),
      {
        wrapper: Wrapper
      }
    );

    expect(typeof result.current.add).toBe('function');

    expect(typeof result.current.remove).toBe('function');

    expect(result.current.list).toEqual([]);
  });

  it('Add methods adds item to the back of the list', () => {
    const { result } = renderHook(() => useFormArray({ factory, fieldId: 'users', initialValue }), {
      wrapper: Wrapper
    });

    act(() => {
      result.current.add();
    });

    expect(result.current.list).toEqual([...initialValue, factory()]);
  });

  it('Remove method removes the right element from the list', () => {
    const { result } = renderHook(() => useFormArray({ factory, fieldId: 'users', initialValue }), {
      wrapper: Wrapper
    });

    act(() => {
      result.current.add();
    });

    act(() => {
      result.current.remove(0);
    });

    expect(result.current.list).toEqual([factory()]);
  });

  it('Resets to the exact reset state', () => {
    jest.useFakeTimers();

    window.requestAnimationFrame = setTimeout;

    const { result } = renderHook(() => useFormArray({ factory, fieldId: 'users', initialValue }), {
      wrapper: WrapperWithReset,
      initialProps: {
        resetKey: 'users',
        resetState: { users: initialValue }
      }
    });

    act(() => {
      result.current.add();
    });

    act(() => {
      // Run reset in the Reset component
      jest.advanceTimersToNextTimer();
    });

    // Test the array reset logic:
    expect(result.current.list).toEqual([]);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.list).toEqual(initialValue);
  });

  it('Resets to the root reset state', () => {
    jest.useFakeTimers();

    window.requestAnimationFrame = setTimeout;

    const { result } = renderHook(() => useFormArray({ factory, fieldId: 'users', initialValue }), {
      wrapper: WrapperWithReset,
      initialProps: {
        resetKey: ROOT_RESET_RECORD_KEY,
        resetState: { users: initialValue }
      }
    });

    act(() => {
      result.current.add();
    });

    act(() => {
      // Run reset in the Reset component
      jest.advanceTimersToNextTimer();
    });

    // Test the array reset logic:
    expect(result.current.list).toEqual([]);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.list).toEqual(initialValue);
  });

  it('Resets to the initial reset state', () => {
    jest.useFakeTimers();

    window.requestAnimationFrame = setTimeout;

    const { result } = renderHook(() => useFormArray({ factory, fieldId: 'users', initialValue }), {
      wrapper: WrapperWithReset,
      initialProps: {
        resetKey: INITIAL_RESET_RECORD_KEY,
        resetState: { users: initialValue }
      }
    });

    act(() => {
      result.current.add();
    });

    act(() => {
      // Run reset in the Reset component
      jest.advanceTimersToNextTimer();
    });

    // Test the array reset logic:
    expect(result.current.list).toEqual([]);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.list).toEqual([]);
  });

  it("Doesn't resets if not matching resetKey", () => {
    jest.useFakeTimers();

    window.requestAnimationFrame = setTimeout;

    const { result } = renderHook(() => useFormArray({ factory, fieldId: 'users', initialValue }), {
      wrapper: WrapperWithReset,
      initialProps: {
        resetKey: 'phones',
        resetState: { users: initialValue }
      }
    });

    act(() => {
      result.current.add();
    });

    act(() => {
      // Run reset in the Reset component
      jest.advanceTimersToNextTimer();
    });

    expect(result.current.list).toEqual([...initialValue, factory()]);
  });
});
