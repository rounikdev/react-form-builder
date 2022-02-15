import { FC, FocusEventHandler, MutableRefObject, useEffect } from 'react';

import { ShowHide, testRender } from '@services/utils';

import { Form } from '../../../Form';
import { useField, useForm } from '../../../hooks';
import { Formatter, DependencyExtractor, Validator } from '../../../types';

import { FormDataProvider, useFormData } from '../FormDataProvider';

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
  const { errors, formData } = useFormData();
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

describe('FormDataProvider and useFormData', () => {
  it('Has display name', () => {
    expect(FormDataProvider.displayName).toBe('FormDataProvider');
  });

  it('Provides the right form state', () => {
    const fieldNameA = 'firstName';
    const fieldNameB = 'lastName';
    const validA = true;
    const validB = true;
    const valueA = 'Ivan';
    const valueB = 'Ivan';

    const { getByDataTest } = testRender(
      <Form formTag>
        <StateReader />
        <TestComponent name={fieldNameA} valid={validA} value={valueA} />
        <TestComponent name={fieldNameB} valid={validB} value={valueB} />
      </Form>
    );

    const formData = JSON.parse(getByDataTest('formData').textContent || '');
    expect(formData).toEqual({ [fieldNameA]: valueA, [fieldNameB]: valueB });
  });

  it('Provides the right form errors state if no errors', () => {
    const fieldNameA = 'firstName';
    const fieldNameB = 'lastName';

    const { getByDataTest } = testRender(
      <Form formTag>
        <StateReader />
        <TestInput name={fieldNameA} />
        <TestInput name={fieldNameB} />
      </Form>
    );

    const errors = JSON.parse(getByDataTest('errors').textContent || '');

    expect(errors).toEqual({});
  });

  it('Provides the right form errors state if there are errors', async () => {
    const { findByDataTest } = testRender(
      <ShowHide show={true}>
        {(show) => {
          return (
            <Form formTag>
              <StateReader />
              {show ? <TestInput name="name" validator={requiredValidator} /> : null}
              <Form name="address">
                <Form name="street">
                  <TestInput name="name" validator={requiredValidator} />
                </Form>
              </Form>
            </Form>
          );
        }}
      </ShowHide>
    );

    const errors = JSON.parse((await findByDataTest('errors')).textContent || '');

    expect(errors).toEqual({
      name: [{ text: 'requiredField' }],
      'address.street.name': [{ text: 'requiredField' }]
    });
  });

  it('Provides the right form errors state if field with error is removed', async () => {
    const Component = ({ show }: { show: boolean }) => (
      <ShowHide show={show}>
        {(shouldShow) => {
          return (
            <Form formTag>
              <StateReader />
              {shouldShow ? <TestInput name="name" validator={requiredValidator} /> : null}
              <Form name="address">
                <Form name="street">
                  <TestInput name="name" validator={requiredValidator} />
                </Form>
              </Form>
            </Form>
          );
        }}
      </ShowHide>
    );

    const { findByDataTest, getByDataTest, rerender } = testRender(<Component show={true} />);

    let errors = JSON.parse((await findByDataTest('errors')).textContent || '');

    expect(errors).toEqual({
      name: [{ text: 'requiredField' }],
      'address.street.name': [{ text: 'requiredField' }]
    });

    rerender(<Component show={false} />);

    errors = JSON.parse(getByDataTest('errors').textContent || '');

    expect(errors).toEqual({
      'address.street.name': [{ text: 'requiredField' }]
    });
  });

  it('Provides the right form errors state if nested field with error is removed', async () => {
    const Component = ({ show }: { show: boolean }) => (
      <ShowHide show={show}>
        {(shouldShow) => {
          return (
            <Form formTag>
              <StateReader />
              <TestInput name="name" validator={requiredValidator} />
              {shouldShow ? (
                <Form name="address">
                  <Form name="street">
                    <TestInput name="name" validator={requiredValidator} />
                  </Form>
                </Form>
              ) : null}
            </Form>
          );
        }}
      </ShowHide>
    );

    const { findByDataTest, getByDataTest, rerender } = testRender(<Component show={true} />);

    let errors = JSON.parse((await (await findByDataTest('errors')).textContent) || '');

    expect(errors).toEqual({
      name: [{ text: 'requiredField' }],
      'address.street.name': [{ text: 'requiredField' }]
    });

    rerender(<Component show={false} />);

    errors = JSON.parse(getByDataTest('errors').textContent || '');

    expect(errors).toEqual({
      name: [{ text: 'requiredField' }]
    });
  });
});
