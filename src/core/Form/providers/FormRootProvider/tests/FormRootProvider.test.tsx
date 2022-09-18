import { FC, FocusEventHandler, MutableRefObject, useEffect } from 'react';

import { FormObject, FormRoot } from '@core/Form/components';
import { useField, useForm } from '@core/Form/hooks';
import { DependencyExtractor, Formatter, Validator } from '@core/Form/types';
import { ShowHide, testRender } from '@services/utils';

import { FormRootProvider, useFormRoot } from '../FormRootProvider';

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

interface FormTestComponent {
  name: string;
  valid: boolean;
  value: string;
}

const TestComponent: FC<FormTestComponent> = ({ name, valid, value }) => {
  const { methods } = useForm();

  useEffect(() => {
    methods.setInForm({ key: name, valid, value });

    return () => methods.removeFromForm({ key: name });
  }, [methods, name, valid, value]);

  return null;
};

const StateReader = () => {
  const { errors, formData } = useFormRoot();
  return (
    <div>
      <div data-test="formData">{JSON.stringify(formData)}</div>
      <div data-test="errors">{JSON.stringify(errors)}</div>
    </div>
  );
};

const requiredValidator: Validator<unknown> = (value: unknown) => {
  return !!value
    ? {
        errors: [],
        valid: true
      }
    : {
        errors: [{ text: 'requiredField' }],
        valid: false
      };
};

describe('FormRootProvider and useFormRoot', () => {
  it('Has display name', () => {
    expect(FormRootProvider.displayName).toBe('FormRootProvider');
  });

  it('Provides the right form state', () => {
    const fieldNameA = 'firstName';
    const fieldNameB = 'lastName';
    const validA = true;
    const validB = true;
    const valueA = 'Ivan';
    const valueB = 'Ivan';

    const { getByDataTest } = testRender(
      <FormRoot dataTest="root-form">
        <StateReader />
        <TestComponent name={fieldNameA} valid={validA} value={valueA} />
        <TestComponent name={fieldNameB} valid={validB} value={valueB} />
      </FormRoot>
    );

    const formData = JSON.parse(getByDataTest('formData').textContent || '');
    expect(formData).toEqual({ [fieldNameA]: valueA, [fieldNameB]: valueB });
  });

  it('Provides the right form errors state if no errors', () => {
    const fieldNameA = 'firstName';
    const fieldNameB = 'lastName';

    const { getByDataTest } = testRender(
      <FormRoot dataTest="root-form">
        <StateReader />
        <TestInput name={fieldNameA} />
        <TestInput name={fieldNameB} />
      </FormRoot>
    );

    const errors = JSON.parse(getByDataTest('errors').textContent || '');

    expect(errors).toEqual({});
  });

  it('Provides the right form errors state if there are errors', async () => {
    const { findByDataTest } = testRender(
      <ShowHide show={true}>
        {(show) => {
          return (
            <FormRoot dataTest="root-form">
              <StateReader />
              {show ? <TestInput name="name" validator={requiredValidator} /> : null}
              <FormObject name="address">
                <FormObject name="street">
                  <TestInput name="name" validator={requiredValidator} />
                </FormObject>
              </FormObject>
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const errors = JSON.parse((await findByDataTest('errors')).textContent || '');

    expect(errors).toEqual({
      'address.street.name': [{ text: 'requiredField' }],
      name: [{ text: 'requiredField' }]
    });
  });

  it('Provides the right form errors state if field with error is removed', async () => {
    const Component = ({ show }: { show: boolean }) => (
      <ShowHide show={show}>
        {(shouldShow) => {
          return (
            <FormRoot dataTest="root-form">
              <StateReader />
              {shouldShow ? <TestInput name="name" validator={requiredValidator} /> : null}
              <FormObject name="address">
                <FormObject name="street">
                  <TestInput name="name" validator={requiredValidator} />
                </FormObject>
              </FormObject>
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const { findByDataTest, getByDataTest, rerender } = testRender(<Component show={true} />);

    let errors = JSON.parse((await findByDataTest('errors')).textContent || '');

    expect(errors).toEqual({
      'address.street.name': [{ text: 'requiredField' }],
      name: [{ text: 'requiredField' }]
    });

    rerender(<Component show={false} />);

    errors = JSON.parse(getByDataTest('errors').textContent || '');

    expect(errors).toEqual({
      'address.street.name': [{ text: 'requiredField' }]
    });
  });

  // TODO: fix this
  it('Provides the right form errors state if nested field with error is removed', async () => {
    const Component = ({ show }: { show: boolean }) => (
      <ShowHide show={show}>
        {(shouldShow) => {
          return (
            <FormRoot dataTest="root-form">
              <StateReader />
              <TestInput name="name" validator={requiredValidator} />
              {shouldShow ? (
                <FormObject name="address">
                  <FormObject name="street">
                    <TestInput name="name" validator={requiredValidator} />
                  </FormObject>
                </FormObject>
              ) : null}
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const { findByDataTest, getByDataTest, rerender } = testRender(<Component show={true} />);

    const errorsContainer = await findByDataTest('errors');

    let errors = JSON.parse(errorsContainer.textContent || '');

    expect(errors).toEqual({
      'address.street.name': [{ text: 'requiredField' }],
      name: [{ text: 'requiredField' }]
    });

    rerender(<Component show={false} />);

    errors = JSON.parse(getByDataTest('errors').textContent || '');

    expect(errors).toEqual({
      name: [{ text: 'requiredField' }]
    });
  });
});
