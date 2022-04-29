import { FC, FocusEventHandler, MutableRefObject, useEffect } from 'react';
import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import { ShowHide, testRender } from '@services/utils';

import { FormObject, FormRoot } from '../../../components';
import { useFormRoot } from '../../../providers';
import { Formatter, DependencyExtractor, Validator } from '../../../types';
import { useForm } from '../../useForm/useForm';

import { useField } from '../useField';

interface TestInputProps<T> {
  dataTestInput?: string;
  dataTestState?: string;
  dependencyExtractor?: DependencyExtractor;
  formatter?: Formatter<T>;
  initialValue?: T;
  name: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  sideEffect?: ({ value }: { value: T }) => void;
  validator?: Validator<T>;
}

const BigIntTestInput: FC<TestInputProps<BigInt>> = ({
  dataTestInput = 'input',
  dependencyExtractor,
  formatter,
  initialValue,
  name,
  onBlur,
  onFocus,
  sideEffect,
  validator
}) => {
  const { fieldRef, ...state } = useField<BigInt>({
    dependencyExtractor,
    formatter,
    initialValue: initialValue || BigInt(0),
    name,
    onBlur,
    onFocus,
    sideEffect,
    validator
  });
  return (
    <>
      <input
        data-test={dataTestInput}
        onBlur={state.onBlurHandler}
        onChange={() => state.onChangeHandler(BigInt(1))}
        onFocus={state.onFocusHandler}
        ref={fieldRef as MutableRefObject<HTMLInputElement>}
      />
    </>
  );
};

const TestInput: FC<TestInputProps<string>> = ({
  dataTestInput = 'input',
  dataTestState = 'state',
  dependencyExtractor,
  formatter,
  initialValue,
  name,
  onBlur,
  onFocus,
  sideEffect,
  validator
}) => {
  const { fieldRef, ...state } = useField<string>({
    dependencyExtractor,
    formatter,
    initialValue: initialValue || '',
    name,
    onBlur,
    onFocus,
    sideEffect,
    validator
  });
  return (
    <>
      <input
        aria-invalid={!state.valid}
        data-test={dataTestInput}
        onBlur={state.onBlurHandler}
        onChange={(event) => state.onChangeHandler(event.target.value)}
        onFocus={state.onFocusHandler}
        ref={fieldRef as MutableRefObject<HTMLInputElement>}
        value={state.value}
      />
      <div data-test={dataTestState}>{JSON.stringify(state)}</div>
    </>
  );
};

describe('useField', () => {
  it('Provides value when initialValue is set inline', () => {
    const initialValue = 'Ivan';
    const name = 'firstName';

    const { result } = renderHook(() => useField({ initialValue, name }));

    expect(result.current.value).toBe(initialValue);
  });

  it('Validates initialValue', async () => {
    const error = 'Length must be more than 3 characters';
    const initialValue = 'Ivan';
    const name = 'firstName';
    const validator: Validator<string> = (value) => {
      if (value.length > 4) {
        return {
          errors: [],
          valid: true
        };
      } else {
        return { errors: [{ text: error }], valid: false };
      }
    };

    const { result, waitForNextUpdate } = renderHook(() =>
      useField({ initialValue, name, validator })
    );

    expect(result.current.valid).toBe(false);
    expect(result.current.validating).toBe(true);
    expect(result.current.errors).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.valid).toBe(false);
    expect(result.current.validating).toBe(false);
    expect(result.current.errors).toEqual([{ text: error }]);
  });

  it('Handles validator error', () => {
    const error = 'errorValidating';
    const initialValue = 'Ivan';
    const name = 'firstName';
    const validator: Validator<string> = () => {
      throw new Error();
    };

    const { result } = renderHook(() => useField({ initialValue, name, validator }));

    expect(result.current.valid).toBe(false);
    expect(result.current.validating).toBe(false);
    expect(result.current.errors).toEqual([{ text: error }]);
  });

  it('Handles setState on unmounted', () => {
    const initialValue = 'Ivan';
    const name = 'firstName';

    jest.useFakeTimers();

    const validator: Validator<string> = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            errors: [],
            valid: true
          });
        }, 1000);
      });
    };

    const { unmount } = renderHook(() => useField({ initialValue, name, validator }));

    jest.runAllTimers();

    unmount();
  });

  it('Sets "touched" to true when force validate is triggered', () => {
    const name = 'firstName';
    const initialValue = 'Ivan';

    const ForceValidateTrigger = () => {
      const { methods } = useForm();

      useEffect(() => {
        methods.forceValidate();
      }, [methods]);

      return null;
    };

    const Wrapper: FC = ({ children }) => (
      <FormRoot dataTest="root-form">
        <ForceValidateTrigger />
        {children}
      </FormRoot>
    );

    const { result } = renderHook(() => useField({ initialValue, name }), { wrapper: Wrapper });

    expect(result.current.touched).toBe(true);
  });

  // eslint-disable-next-line max-len
  it('Sets the value to initialValue when reset is triggered and initialValue is provided inline', async () => {
    const changedValue = 'Maria';
    const initialValue = 'Ivan';
    const name = 'firstName';

    const ResetButton = () => {
      const { methods } = useForm();

      return <button data-test="reset" onClick={methods.reset}></button>;
    };

    const { findByDataTest, getByDataTest } = testRender(
      <FormRoot dataTest="root-form">
        <TestInput initialValue={initialValue} name={name} />
        <ResetButton />
      </FormRoot>
    );

    const stateA = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateA.value).toBe(initialValue);

    userEvent.clear(getByDataTest('input'));
    userEvent.type(getByDataTest('input'), changedValue);

    const stateB = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateB.value).toBe(changedValue);

    userEvent.click(getByDataTest('reset'));

    const stateC = JSON.parse((await findByDataTest('state')).textContent || '');
    expect(stateC.value).toBe(initialValue);
  });

  it(`Handles focus events and provides correct touched and focused flags. 
      Calls onFocus and onBlur when provided`, () => {
    const initialValue = 'Ivan';
    const name = 'firstName';
    const onBlurMockHandler = jest.fn();
    const onFocusMockHandler = jest.fn();

    const { getByDataTest } = testRender(
      <TestInput
        initialValue={initialValue}
        name={name}
        onBlur={onBlurMockHandler}
        onFocus={onFocusMockHandler}
      />
    );

    fireEvent.focus(getByDataTest('input'));

    const stateA = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateA.focused).toBe(true);
    expect(stateA.touched).toBe(true);

    fireEvent.blur(getByDataTest('input'));

    const stateB = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateB.focused).toBe(false);
    expect(stateB.touched).toBe(true);

    expect(onFocusMockHandler).toHaveBeenCalledTimes(1);
    expect(onBlurMockHandler).toHaveBeenCalledTimes(1);
  });

  it(`Handles focus events and provides correct touched and focused flags. 
      No onFocus or onBlur provided`, async () => {
    const initialValue = 'Ivan';
    const name = 'firstName';

    const { getByDataTest } = testRender(<TestInput initialValue={initialValue} name={name} />);

    fireEvent.focus(getByDataTest('input'));

    const stateA = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateA.focused).toBe(true);
    expect(stateA.touched).toBe(true);

    fireEvent.blur(getByDataTest('input'));

    const stateB = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateB.focused).toBe(false);
    expect(stateB.touched).toBe(true);
  });

  it('Validates with dependency', async () => {
    const fieldNameA = 'password';
    const fieldNameB = 'repeatPassword';
    const initialValueA = '123456';
    const initialValueB = '12345';
    const error = "Passwords don't match";

    const validator: Validator<string> = (value, dependencyValue) => {
      if (value === dependencyValue) {
        return {
          errors: [],
          valid: true
        };
      } else {
        return { errors: [{ text: error }], valid: false };
      }
    };

    const dependencyExtractor: DependencyExtractor = (formData) => formData[fieldNameA];

    const { findByDataTest, getByDataTest } = testRender(
      <FormRoot dataTest="root-form" onSubmit={jest.fn()}>
        <TestInput dataTestState="stateA" initialValue={initialValueA} name={fieldNameA} />
        <TestInput
          dataTestInput="inputB"
          dataTestState="stateB"
          dependencyExtractor={dependencyExtractor}
          initialValue={initialValueB}
          name={fieldNameB}
          validator={validator}
        />
      </FormRoot>
    );

    const stateB = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(stateB.valid).toBe(false);
    expect(stateB.errors).toEqual([{ text: error }]);

    userEvent.clear(getByDataTest('inputB'));
    userEvent.type(getByDataTest('inputB'), initialValueA);

    const updatedStateB = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(updatedStateB.valid).toBe(true);
    expect(updatedStateB.errors).toEqual([]);

    userEvent.clear(getByDataTest('input'));
    userEvent.type(getByDataTest('input'), initialValueB);

    const updatedStateC = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(updatedStateC.valid).toBe(false);
    expect(updatedStateC.errors).toEqual([{ text: error }]);
  });

  it('Validates with dependency as object', async () => {
    const fieldNameA = 'password';
    const fieldNameB = 'repeatPassword';
    const initialValueA = '123456';
    const initialValueB = '12345';
    const error = "Passwords don't match";

    const validator: Validator<string> = (value, dependencyValue) => {
      if (value === dependencyValue?.name) {
        return {
          errors: [],
          valid: true
        };
      } else {
        return { errors: [{ text: error }], valid: false };
      }
    };

    const dependencyExtractor: DependencyExtractor = (formData) => ({ name: formData[fieldNameA] });

    const { findByDataTest, getByDataTest } = testRender(
      <FormRoot dataTest="root-form" onSubmit={jest.fn()}>
        <TestInput dataTestState="stateA" initialValue={initialValueA} name={fieldNameA} />
        <TestInput
          dataTestInput="inputB"
          dataTestState="stateB"
          dependencyExtractor={dependencyExtractor}
          initialValue={initialValueB}
          name={fieldNameB}
          validator={validator}
        />
      </FormRoot>
    );

    const stateB = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(stateB.valid).toBe(false);
    expect(stateB.errors).toEqual([{ text: error }]);

    userEvent.clear(getByDataTest('inputB'));
    userEvent.type(getByDataTest('inputB'), initialValueA);

    const updatedStateB = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(updatedStateB.valid).toBe(true);
    expect(updatedStateB.errors).toEqual([]);

    userEvent.clear(getByDataTest('input'));
    userEvent.type(getByDataTest('input'), initialValueB);

    const updatedStateC = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(updatedStateC.valid).toBe(false);
    expect(updatedStateC.errors).toEqual([{ text: error }]);
  });

  it('Validates with dependency as array', async () => {
    const fieldNameA = 'password';
    const fieldNameB = 'repeatPassword';
    const initialValueA = '123456';
    const initialValueB = '12345';
    const error = "Passwords don't match";

    const validator: Validator<string> = (value, [dependencyValue]) => {
      if (value === dependencyValue) {
        return {
          errors: [],
          valid: true
        };
      } else {
        return { errors: [{ text: error }], valid: false };
      }
    };

    const dependencyExtractor: DependencyExtractor = (formData) => [formData[fieldNameA]];

    const { findByDataTest, getByDataTest } = testRender(
      <FormRoot dataTest="root-form" onSubmit={jest.fn()}>
        <TestInput dataTestState="stateA" initialValue={initialValueA} name={fieldNameA} />
        <TestInput
          dataTestInput="inputB"
          dataTestState="stateB"
          dependencyExtractor={dependencyExtractor}
          initialValue={initialValueB}
          name={fieldNameB}
          validator={validator}
        />
      </FormRoot>
    );

    const stateB = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(stateB.valid).toBe(false);
    expect(stateB.errors).toEqual([{ text: error }]);

    userEvent.clear(getByDataTest('inputB'));
    userEvent.type(getByDataTest('inputB'), initialValueA);

    const updatedStateB = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(updatedStateB.valid).toBe(true);
    expect(updatedStateB.errors).toEqual([]);

    userEvent.clear(getByDataTest('input'));
    userEvent.type(getByDataTest('input'), initialValueB);

    const updatedStateC = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(updatedStateC.valid).toBe(false);
    expect(updatedStateC.errors).toEqual([{ text: error }]);
  });

  it('Validates with BigInt as dependency', async () => {
    const fieldNameA = 'password';
    const fieldNameB = 'repeatPassword';
    const initialValueA = '123456';
    const initialValueB = '12345';
    const error = 'BigInt must be 1';

    const validator: Validator<string> = (value, dependencyValue) => {
      if (dependencyValue == 1 && value === initialValueA) {
        return {
          errors: [],
          valid: true
        };
      } else {
        return { errors: [{ text: error }], valid: false };
      }
    };

    const dependencyExtractor: DependencyExtractor = (formData) => formData[fieldNameA];

    const { findByDataTest, getByDataTest } = testRender(
      <FormRoot dataTest="root-form" onSubmit={jest.fn()}>
        <BigIntTestInput dataTestState="stateA" name={fieldNameA} />
        <TestInput
          dataTestInput="inputB"
          dataTestState="stateB"
          dependencyExtractor={dependencyExtractor}
          initialValue={initialValueB}
          name={fieldNameB}
          validator={validator}
        />
      </FormRoot>
    );

    const stateB = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(stateB.valid).toBe(false);
    expect(stateB.errors).toEqual([{ text: error }]);

    userEvent.clear(getByDataTest('inputB'));
    userEvent.type(getByDataTest('inputB'), initialValueA);

    const updatedStateB = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(updatedStateB.valid).toBe(false);
    expect(updatedStateB.errors).toEqual([{ text: error }]);

    userEvent.clear(getByDataTest('input'));
    userEvent.type(getByDataTest('input'), 'something');

    const updatedStateB2 = JSON.parse((await findByDataTest('stateB')).textContent || '');
    expect(updatedStateB2.valid).toBe(true);
    expect(updatedStateB2.errors).toEqual([]);
  });

  it('Removes the field data from the form state on field unmount', () => {
    const fieldName = 'firstName';
    const initialValue = 'Ivan';

    const StateReader = () => {
      const { state } = useForm();

      return <div data-test="form-state">{JSON.stringify(state)}</div>;
    };

    const Component = ({ show }: { show: boolean }) => (
      <ShowHide show={show}>
        {(shouldShow) => {
          return (
            <FormRoot dataTest="root-form">
              <StateReader />
              {shouldShow ? <TestInput initialValue={initialValue} name={fieldName} /> : null}
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const { getByDataTest, rerender } = testRender(<Component show={true} />);

    const formStateA = JSON.parse(getByDataTest('form-state').textContent || '');
    expect(formStateA).toEqual({ [fieldName]: { valid: true, value: initialValue } });

    rerender(<Component show={false} />);

    const formStateB = JSON.parse(getByDataTest('form-state').textContent || '');
    expect(formStateB).toEqual({});
  });

  it('Formatter formats value on mount', () => {
    const formatter: Formatter<string> = ({ newValue }) =>
      newValue ? `${newValue.charAt(0).toUpperCase()}${newValue.substring(1)}` : newValue;
    const initialValue = 'ivan';
    const name = 'firstName';

    const { result } = renderHook(() => useField({ formatter, initialValue, name }));

    expect(result.current.value).toBe(
      formatter({ newValue: initialValue, oldValue: initialValue })
    );
  });

  it('Sets the value to initial formatted value when reset is triggered', async () => {
    const fieldName = 'firstName';
    const initialValue = 'ivan';
    const changedValue = 'maria';
    const formatter: Formatter<string> = ({ newValue }) =>
      newValue ? `${newValue.charAt(0).toUpperCase()}${newValue.substring(1)}` : newValue;

    const ResetButton = () => {
      const { methods } = useForm();

      return (
        <button
          data-test="reset"
          onClick={() => {
            methods.reset();
          }}
        ></button>
      );
    };

    const { findByDataTest, getByDataTest } = testRender(
      <FormRoot dataTest="root-form">
        <TestInput formatter={formatter} initialValue={initialValue} name={fieldName} />
        <ResetButton />
      </FormRoot>
    );

    const stateA = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateA.value).toBe(formatter({ newValue: initialValue, oldValue: initialValue }));

    userEvent.clear(getByDataTest('input'));
    userEvent.type(getByDataTest('input'), changedValue);

    const stateB = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateB.value).toBe(formatter({ newValue: changedValue, oldValue: initialValue }));

    userEvent.click(getByDataTest('reset'));

    const stateC = JSON.parse((await findByDataTest('state')).textContent || '');
    expect(stateC.value).toBe(formatter({ newValue: initialValue, oldValue: initialValue }));
  });

  it('Updates the value when the initialValue provided inline is updated', () => {
    const name = 'firstName';
    const initialValueA = 'Ivan';
    const initialValueB = 'Maria';

    const { rerender, result } = renderHook(
      ({ initialValue }) => useField({ initialValue, name }),
      { initialProps: { initialValue: initialValueA } }
    );

    expect(result.current.value).toBe(initialValueA);
    expect(result.current.valid).toBe(true);

    rerender({ initialValue: initialValueB });

    expect(result.current.value).toBe(initialValueB);
    expect(result.current.valid).toBe(true);
  });

  // eslint-disable-next-line max-len
  it('Calls the sideEffect callback on value change and provides value and Form context methods as arguments', async () => {
    const fieldName = 'firstName';
    const initialValue = 'Ivan';
    const changedValue = 'Maria';

    const sideEffectMock = jest.fn();

    const { getByDataTest } = testRender(
      <FormRoot dataTest="root-form">
        <TestInput initialValue={initialValue} name={fieldName} sideEffect={sideEffectMock} />
      </FormRoot>
    );

    const stateA = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateA.value).toBe(initialValue);

    userEvent.clear(getByDataTest('input'));
    userEvent.type(getByDataTest('input'), changedValue);

    const firstCall = sideEffectMock.mock.calls[0];
    expect(typeof firstCall[0].methods).toBe('object');
    expect(typeof firstCall[0].methods.forceValidate).toBe('function');
    expect(typeof firstCall[0].methods.getFieldId).toBe('function');
    expect(typeof firstCall[0].methods.removeFromForm).toBe('function');
    expect(typeof firstCall[0].methods.reset).toBe('function');
    expect(typeof firstCall[0].methods.setInForm).toBe('function');
    expect(firstCall[0].value).toEqual(initialValue);

    const lastCall = sideEffectMock.mock.calls.pop();
    expect(lastCall[0].value).toEqual(changedValue);
  });

  it('Calls focus on the field element from the root form context', () => {
    const initialValue = 'Ivan';
    const name = 'firstName';

    const FocusButton = () => {
      const { methods } = useFormRoot();

      return <button data-test="focus" onClick={() => methods.focusField(name)}></button>;
    };

    const { getByDataTest } = testRender(
      <FormRoot dataTest="root-form" onSubmit={jest.fn()}>
        <TestInput initialValue={initialValue} name={name} />
        <FocusButton />
      </FormRoot>
    );

    const input = getByDataTest('focus');
    const mockFocus = jest.fn();
    input.focus = mockFocus;

    expect(mockFocus).toHaveBeenCalledTimes(0);

    userEvent.click(getByDataTest('focus'));

    expect(mockFocus).toHaveBeenCalledTimes(1);
  });

  it('Calls scrollIntoView on the field element from the root form context', () => {
    const initialValue = 'Ivan';
    const name = 'firstName';

    const ScrollButton = () => {
      const { methods } = useFormRoot();

      return (
        <button
          data-test="scroll-into-view"
          onClick={() => methods.scrollFieldIntoView(name)}
        ></button>
      );
    };

    const { getByDataTest } = testRender(
      <FormRoot dataTest="root-form" onSubmit={jest.fn()}>
        <TestInput initialValue={initialValue} name={name} />
        <ScrollButton />
      </FormRoot>
    );

    const input = getByDataTest('input');
    const mockScrollIntoView = jest.fn();
    input.scrollIntoView = mockScrollIntoView;

    expect(mockScrollIntoView).toHaveBeenCalledTimes(0);

    userEvent.click(getByDataTest('scroll-into-view'));

    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('Sets the value from the root form context. Validating with dependency.', async () => {
    const initialValue = 'Ivan';
    const changedValue = 'Peter';
    const name = 'firstName';
    const dependencyName = 'lastName';
    const error = 'Error';

    const SetValueButton = () => {
      const { methods } = useFormRoot();

      return (
        <button
          data-test="set-field-value"
          onClick={() => methods.setFieldValue({ id: name, value: changedValue })}
        ></button>
      );
    };

    const { findByDataTest, getByDataTest } = testRender(
      <FormRoot dataTest="root-form" onSubmit={jest.fn()}>
        <TestInput
          initialValue={initialValue}
          name={name}
          dependencyExtractor={(formData) => formData[dependencyName]}
          validator={(firstName, lastName) => {
            if (firstName === lastName) {
              return { errors: [], valid: true };
            } else {
              return {
                errors: [{ text: error }],
                valid: false
              };
            }
          }}
        />
        <TestInput
          dataTestInput="dependency-input"
          initialValue={changedValue}
          name={dependencyName}
        />
        <SetValueButton />
      </FormRoot>
    );

    expect(await findByDataTest('input')).toHaveValue(initialValue);
    expect(getByDataTest('input')).not.toBeValid();

    userEvent.click(getByDataTest('set-field-value'));

    expect(await findByDataTest('input')).toHaveValue(changedValue);
    expect(getByDataTest('input')).toBeValid();
  });
});
