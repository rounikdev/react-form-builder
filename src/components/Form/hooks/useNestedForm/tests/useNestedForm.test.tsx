import { FC } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { useUpdate, useUpdateOnly } from '@rounik/react-custom-hooks';

import { FormObject, FormRoot } from '../../../components';
import { useFormRoot } from '../../../providers';
import { FormRootProviderContext, ResetFlag } from '../../../types';

import { useForm } from '../../useForm/useForm';

import { useNestedForm } from '../useNestedForm';

interface ParentFormActorProps {
  onResetFlag?: (resetFlag: ResetFlag) => void;
  onResetRecords?: (resetRecords: FormRootProviderContext['resetRecords']) => void;
  shouldEdit?: boolean;
  shouldForceValidate?: boolean;
}

const ParentFormActor: FC<ParentFormActorProps> = ({
  onResetFlag,
  onResetRecords,
  shouldEdit,
  shouldForceValidate
}) => {
  const { resetFlag, resetRecords } = useFormRoot();

  const {
    methods: { cancel, edit, forceValidate }
  } = useForm();

  useUpdate(() => {
    if (shouldForceValidate) {
      setTimeout(forceValidate);
    }
  }, [shouldForceValidate]);

  useUpdate(() => {
    if (shouldEdit) {
      edit();

      // be explicit here, because we don't want
      // to call cancel if the flag is not provided:
    } else if (shouldEdit === false) {
      cancel();
    }
  }, [shouldEdit]);

  useUpdateOnly(() => {
    if (onResetFlag) {
      onResetFlag(resetFlag);
    }
  }, [resetFlag]);

  useUpdateOnly(() => {
    if (onResetRecords) {
      onResetRecords(resetRecords);
    }
  }, [resetRecords]);

  return null;
};

interface WrapperProps extends ParentFormActorProps {
  parentFormName?: string;
}

const Wrapper: FC<WrapperProps> = ({
  children,
  onResetFlag,
  onResetRecords = () => {},
  parentFormName,
  shouldEdit,
  shouldForceValidate
}) => (
  <FormRoot dataTest="root-form">
    <ParentFormActor
      onResetFlag={onResetFlag}
      onResetRecords={onResetRecords}
      shouldEdit={shouldEdit}
      shouldForceValidate={shouldForceValidate}
    />
    {parentFormName ? <FormObject name={parentFormName}>{children}</FormObject> : children}
  </FormRoot>
);

describe('useNestedForm', () => {
  it('Has the right initial state', () => {
    const name = 'user';

    const valid = true;

    const value = {
      firstName: 'Ivan',
      lastName: 'Ivanov'
    };

    const { result } = renderHook(() => useNestedForm({ name, valid, value }), {
      wrapper: Wrapper
    });

    expect(typeof result.current.cancel).toBe('function');

    expect(typeof result.current.edit).toBe('function');

    expect(typeof result.current.forceValidate).toBe('function');

    expect(result.current.forceValidateFlag).toEqual({});

    expect(result.current.getFieldId()).toBe(name);

    expect(result.current.isEdit).toBe(false);

    expect(result.current.isParentEdit).toBe(false);

    expect(typeof result.current.reset).toBe('function');

    expect(typeof result.current.save).toBe('function');
  });

  it('Calling edit sets the isEdit flag and the corresponding resetState in root', () => {
    const name = 'user';

    const valid = true;

    const value = {
      firstName: 'Ivan',
      lastName: 'Ivanov'
    };

    const mockOnResetRecords = jest.fn();

    const { result } = renderHook(() => useNestedForm({ name, valid, value }), {
      initialProps: { onResetRecords: mockOnResetRecords },
      wrapper: Wrapper
    });

    act(() => {
      result.current.edit();
    });

    expect(result.current.isEdit).toBe(true);

    expect(mockOnResetRecords.mock.lastCall[0][name]).toEqual({
      [name]: value
    });
  });

  // eslint-disable-next-line max-len
  it('Calling edit sets the isEdit flag and the corresponding resetState in root when nested in parent form', () => {
    const name = 'user';

    const parentFormName = 'info';

    const valid = true;

    const value = {
      firstName: 'Ivan',
      lastName: 'Ivanov'
    };

    const mockOnResetRecords = jest.fn();

    const { result } = renderHook(() => useNestedForm({ name, valid, value }), {
      initialProps: { onResetRecords: mockOnResetRecords, parentFormName },
      wrapper: Wrapper
    });

    act(() => {
      result.current.edit();
    });

    expect(result.current.isEdit).toBe(true);

    expect(mockOnResetRecords.mock.lastCall[0][`${parentFormName}.${name}`]).toEqual({
      [parentFormName]: { [name]: value }
    });
  });

  it('Calling save sets the isEdit flag and removes the corresponding resetState in root', () => {
    const name = 'user';

    const valid = true;

    const value = {
      firstName: 'Ivan',
      lastName: 'Ivanov'
    };

    const mockOnResetRecords = jest.fn();

    const { result } = renderHook(() => useNestedForm({ name, valid, value }), {
      initialProps: { onResetRecords: mockOnResetRecords },
      wrapper: Wrapper
    });

    act(() => {
      result.current.edit();
    });

    act(() => {
      result.current.save();
    });

    expect(result.current.isEdit).toBe(false);

    expect(mockOnResetRecords.mock.lastCall[0][name]).toBeUndefined();
  });

  // eslint-disable-next-line max-len
  it('Calling cancel sets the isEdit flag, triggers reset and removes the corresponding resetState in root', () => {
    const name = 'user';

    const valid = true;

    const value = {
      firstName: 'Ivan',
      lastName: 'Ivanov'
    };

    const mockOnResetFlag = jest.fn();

    const mockOnResetRecords = jest.fn();

    jest.useFakeTimers();

    const { result } = renderHook(() => useNestedForm({ name, valid, value }), {
      initialProps: { onResetFlag: mockOnResetFlag, onResetRecords: mockOnResetRecords },
      wrapper: Wrapper
    });

    act(() => {
      result.current.edit();
    });

    act(() => {
      result.current.cancel();
    });

    expect(result.current.isEdit).toBe(false);

    act(() => {
      jest.runAllTimers();
    });

    expect(mockOnResetFlag).toHaveBeenCalledTimes(1);

    expect(mockOnResetFlag.mock.calls[0][0]).toEqual({ resetKey: name });

    expect(mockOnResetRecords.mock.lastCall[0][name]).toBeUndefined();
  });

  it('Canceling parent edit cancels nested form without reset', () => {
    const name = 'user';

    const valid = true;

    const value = {
      firstName: 'Ivan',
      lastName: 'Ivanov'
    };

    const mockOnResetFlag = jest.fn();

    const mockOnResetRecords = jest.fn();

    jest.useFakeTimers();

    const { rerender, result } = renderHook(() => useNestedForm({ name, valid, value }), {
      initialProps: {
        onResetFlag: mockOnResetFlag,
        onResetRecords: mockOnResetRecords,
        shouldEdit: true
      },
      wrapper: Wrapper
    });

    act(() => {
      result.current.edit();
    });

    rerender({ onResetRecords: mockOnResetRecords, shouldEdit: false });

    expect(result.current.isEdit).toBe(false);

    act(() => {
      jest.runAllTimers();
    });

    expect(mockOnResetRecords.mock.lastCall[0][name]).toBeUndefined();

    expect(mockOnResetFlag).not.toHaveBeenCalled();
  });

  it('Parent force validate triggers update in forceValidateFlag', () => {
    const name = 'user';

    const valid = true;

    const value = {
      firstName: 'Ivan',
      lastName: 'Ivanov'
    };

    jest.useFakeTimers();

    const { result } = renderHook(() => useNestedForm({ name, valid, value }), {
      initialProps: { shouldForceValidate: true },
      wrapper: Wrapper
    });

    const initialForceValidateFlag = result.current.forceValidateFlag;

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.forceValidateFlag).not.toBe(initialForceValidateFlag);
  });
});
