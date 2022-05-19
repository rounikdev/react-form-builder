import { FC, useEffect } from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useUpdateOnly } from '@rounik/react-custom-hooks';

import { ShowHide, testRender } from '@services/utils';

import { FormArray, FormObject, FormRoot } from '../components';
// import { initialFormContext } from '../context';

import { useField, useForm } from '../hooks';
// import { reducer } from '../reducers';
import { Validator } from '../types';

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
  const { state, valid } = useForm();

  return (
    <>
      <div data-test="validity">{`${valid}`}</div>
      <div data-test="state">{JSON.stringify(state)}</div>
    </>
  );
};

interface TestMethodButtonProps {
  method: 'forceValidate' | 'reset';
}

const TestMethodButton: FC<TestMethodButtonProps> = ({ method }) => {
  const { methods } = useForm();

  return <button data-test="method-test-button" onClick={() => methods[method]()}></button>;
};

interface EffectDetectorProps {
  callback: () => void;
  flag: 'forceValidateFlag' | 'state';
}

const EffectDetector: FC<EffectDetectorProps> = ({ callback, flag }) => {
  const { methods, ...other } = useForm();

  useUpdateOnly(callback, [callback, other[flag]]);

  return null;
};

describe('FormRoot, FormObject, FormArray and useForm', () => {
  it('FormRoot has display name', () => {
    expect(FormRoot.displayName).toBe('FormRoot');
  });

  it('FormObject has display name', () => {
    expect(FormObject.displayName).toBe('FormObject');
  });

  it('FormArray has display name', () => {
    expect(FormArray.displayName).toBe('FormArray');
  });

  it('methods.setInForm sets the right state in the Form', async () => {
    const fieldName = 'firstName';
    const valid = true;
    const value = 'Ivan';

    const { getByDataTest } = testRender(
      <ShowHide show={true}>
        {(show) => {
          return (
            <FormRoot dataTest="form-root">
              <StateReader />
              {show ? <TestComponent name={fieldName} valid={valid} value={value} /> : null}
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const state = JSON.parse(getByDataTest('state').textContent || '');
    expect(state).toEqual({ [fieldName]: { valid, value } });

    const validity = getByDataTest('validity').textContent;
    expect(validity).toBe(`${valid}`);
  });

  it('onChange prop is called with the correct argument', async () => {
    const fieldName = 'firstName';
    const valid = true;
    const value = 'Ivan';

    const mockOnChange = jest.fn();

    testRender(
      <ShowHide show={true}>
        {(show) => {
          return (
            <FormRoot dataTest="form-root" onChange={mockOnChange}>
              <StateReader />
              {show ? <TestComponent name={fieldName} valid={valid} value={value} /> : null}
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange.mock.calls[0][0]).toEqual({ errors: {}, valid: true, value: {} });
    expect(mockOnChange.mock.calls[1][0]).toEqual({
      errors: {},
      valid: true,
      value: { firstName: 'Ivan' }
    });
  });

  it('No state is updated if same value and valid are provided', async () => {
    const fieldName = 'firstName';
    const valid = true;
    const value = 'Ivan';

    const testData = {
      valid,
      value
    };

    const callback = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = ({ data, show }: { data: any; show: boolean }) => (
      <ShowHide data={data} show={show}>
        {(shouldShow, _data) => {
          return (
            <FormRoot dataTest="form-root">
              <EffectDetector callback={callback} flag="state" />
              {shouldShow ? (
                <TestComponent name={fieldName} valid={_data.valid} value={_data.value} />
              ) : null}
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const { rerender } = testRender(<Component data={testData} show={true} />);

    expect(callback).toHaveBeenCalledTimes(1);

    rerender(
      <Component
        data={{
          valid,
          value
        }}
        show={true}
      />
    );

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('State is updated if different value is provided', async () => {
    const fieldName = 'firstName';
    const valid = true;
    const valueA = 'Ivan';
    const valueB = 'Maria';

    const testData = {
      valid,
      value: valueA
    };

    const callback = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = ({ data, show }: { data: any; show: boolean }) => (
      <ShowHide data={data} show={show}>
        {(shouldShow, _data) => {
          return (
            <FormRoot dataTest="form-root">
              <EffectDetector callback={callback} flag="state" />
              {shouldShow ? (
                <TestComponent name={fieldName} valid={_data.valid} value={_data.value} />
              ) : null}
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const { rerender } = testRender(<Component data={testData} show={true} />);

    expect(callback).toHaveBeenCalledTimes(1);

    rerender(
      <Component
        data={{
          valid,
          value: valueB
        }}
        show={true}
      />
    );

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('State is updated if different valid is provided', async () => {
    const fieldName = 'firstName';
    const validA = true;
    const validB = false;
    const value = 'Ivan';

    const testData = {
      valid: validA,
      value
    };

    const callback = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = ({ data, show }: { data: any; show: boolean }) => (
      <ShowHide data={data} show={show}>
        {(shouldShow, _data) => {
          return (
            <FormRoot dataTest="form-root">
              <EffectDetector callback={callback} flag="state" />
              {shouldShow ? (
                <TestComponent name={fieldName} valid={_data.valid} value={_data.value} />
              ) : null}
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const { rerender } = testRender(<Component data={testData} show={true} />);

    expect(callback).toHaveBeenCalledTimes(1);

    rerender(
      <Component
        data={{
          valid: validB,
          value
        }}
        show={true}
      />
    );

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('methods.removeFromForm removes the right state from the Form', async () => {
    const fieldName = 'firstName';
    const valid = true;
    const value = 'Ivan';

    const Component = ({ show }: { show: boolean }) => (
      <ShowHide show={show}>
        {(shouldShow) => {
          return (
            <FormRoot dataTest="form-root">
              <StateReader />
              {shouldShow ? <TestComponent name={fieldName} valid={valid} value={value} /> : null}
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const { getByDataTest, rerender } = testRender(<Component show={true} />);

    const stateA = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateA).toEqual({ [fieldName]: { valid, value } });

    const validityA = getByDataTest('validity').textContent;
    expect(validityA).toBe(`${valid}`);

    rerender(<Component show={false} />);

    const stateB = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateB).toEqual({});

    const validityB = getByDataTest('validity').textContent;
    expect(validityB).toBe(`${valid}`);
  });

  it('Sets the right state in a parent Form', async () => {
    const fieldName = 'firstName';
    const objectName = 'user';
    const valid = true;
    const value = 'Ivan';

    const { getByDataTest } = testRender(
      <ShowHide show={true}>
        {(show) => {
          return (
            <FormRoot dataTest="form-root">
              <StateReader />
              <FormObject name={objectName}>
                {show ? <TestComponent name={fieldName} valid={valid} value={value} /> : null}
              </FormObject>
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const state = JSON.parse(getByDataTest('state').textContent || '');
    expect(state).toEqual({ [objectName]: { valid, value: { [fieldName]: value } } });

    const validity = getByDataTest('validity').textContent;
    expect(validity).toBe(`${valid}`);
  });

  it('Removes the right state in a parent Form', async () => {
    const fieldName = 'firstName';
    const objectName = 'user';
    const valid = true;
    const value = 'Ivan';

    const Component = ({ show }: { show: boolean }) => (
      <ShowHide show={show}>
        {(shouldShow) => {
          return (
            <FormRoot dataTest="form-root">
              <StateReader />
              {shouldShow ? (
                <FormObject name={objectName}>
                  <TestComponent name={fieldName} valid={valid} value={value} />
                </FormObject>
              ) : null}
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const { getByDataTest, rerender } = testRender(<Component show={true} />);

    const state = JSON.parse(getByDataTest('state').textContent || '');
    expect(state).toEqual({ [objectName]: { valid, value: { [fieldName]: value } } });

    const validity = getByDataTest('validity').textContent;
    expect(validity).toBe(`${valid}`);

    rerender(<Component show={false} />);

    const stateB = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateB).toEqual({});

    const validityB = getByDataTest('validity').textContent;
    expect(validityB).toBe(`${valid}`);
  });

  it('Sets the right array state in a parent Form', async () => {
    const fieldName = 'firstName';
    const arrayName = 'users';
    const users = [
      {
        id: 'user1',
        name: 'Ivan'
      },
      { id: 'user2', name: 'Maria' }
    ];

    const userFactory = () => {
      return {
        id: new Date().getTime(),
        name: ''
      };
    };

    const valid = true;

    const { getByDataTest } = testRender(
      <ShowHide data={users} show={true}>
        {(_, userList: { id: number; name: string }[]) => {
          return (
            <FormRoot dataTest="form-root">
              <StateReader />
              <FormArray factory={userFactory} initialValue={userList} name={arrayName}>
                {([list]) => {
                  return list.map((user, index) => {
                    return (
                      <FormObject key={user.id} name={`${index}`}>
                        <TestComponent name={fieldName} valid={valid} value={user.name} />
                      </FormObject>
                    );
                  });
                }}
              </FormArray>
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const state = JSON.parse(getByDataTest('state').textContent || '');
    expect(state).toEqual({
      [arrayName]: { valid, value: users.map((user) => ({ [fieldName]: user.name })) }
    });

    const validity = getByDataTest('validity').textContent;
    expect(validity).toBe(`${valid}`);
  });

  it('Removes the right array element from the state of a parent Form', () => {
    // const fieldName = 'firstName';
    // const arrayName = 'users';
    // const users = [
    //   {
    //     id: 'user1',
    //     name: 'Ivan'
    //   },
    //   { id: 'user2', name: 'Maria' }
    // ];
    // const valid = true;
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const Component = ({ data, show }: { data: any; show: boolean }) => (
    //   <ShowHide data={data} show={show}>
    //     {(_, userList: { id: string; name: string }[]) => {
    //       return (
    //         <Form>
    //           <StateReader />
    //           <Form name={arrayName} type="array">
    //             {userList.map((user, index) => {
    //               return (
    //                 <Form key={user.id} name={`${index}`}>
    //                   <TestComponent name={fieldName} valid={valid} value={user.name} />
    //                 </Form>
    //               );
    //             })}
    //           </Form>
    //         </Form>
    //       );
    //     }}
    //   </ShowHide>
    // );
    // const { getByDataTest, rerender } = testRender(<Component data={users} show={true} />);
    // const stateA = JSON.parse(getByDataTest('state').textContent || '');
    // expect(stateA).toEqual({
    //   [arrayName]: { valid, value: users.map((user) => ({ [fieldName]: user.name })) }
    // });
    // const validityA = getByDataTest('validity').textContent;
    // expect(validityA).toBe(`${valid}`);
    // // Remove the first user:
    // rerender(<Component data={[users[1]]} show={true} />);
    // const stateB = JSON.parse(getByDataTest('state').textContent || '');
    // // Expect the second user to be the first and only element left:
    // expect(stateB).toEqual({
    //   [arrayName]: { valid, value: [users[1]].map((user) => ({ [fieldName]: user.name })) }
    // });
    // const validityB = getByDataTest('validity').textContent;
    // expect(validityB).toBe(`${valid}`);
  });

  it('Calls onSubmit with the correct arguments', () => {
    const fieldName = 'firstName';
    const valid = true;
    const value = 'Ivan';

    const onSubmit = jest.fn();

    const { getByDataTest } = testRender(
      <ShowHide show={true}>
        {() => {
          return (
            <FormRoot dataTest="test" onSubmit={onSubmit}>
              <TestComponent name={fieldName} valid={valid} value={value} />
            </FormRoot>
          );
        }}
      </ShowHide>
    );

    const form = getByDataTest('test-form');

    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ valid, value: { [fieldName]: value } });
  });

  it('Force validate flag updates', () => {
    const callback = jest.fn();

    const { getByDataTest } = testRender(
      <FormRoot dataTest="root-form">
        <TestMethodButton method="forceValidate" />
        <FormObject name="nested-form">
          <EffectDetector callback={callback} flag="forceValidateFlag" />
        </FormObject>
      </FormRoot>
    );

    const button = getByDataTest('method-test-button');
    userEvent.click(button);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('Form reducer returns state as default', () => {
    // const newState = reducer(initialFormContext, {
    //   payload: { key: '', type: '' },
    //   type: 'SOME_UNEXPECTED_TYPE' as 'REMOVE_FROM_FORM'
    // });
    // expect(newState).toEqual(initialFormContext);
  });

  // eslint-disable-next-line max-len
  it('Form reducer returns state without modifying it if no change in value or valid when setting field data', () => {
    // const newState = reducer(initialFormContext, {
    //   payload: { key: 'firstName', valid: true, value: 'Ivan' },
    //   type: 'SET_IN_FORM'
    // });
    // expect(newState).toEqual({
    //   ...initialFormContext,
    //   state: {
    //     firstName: {
    //       valid: true,
    //       value: 'Ivan'
    //     }
    //   }
    // });
    // const newStateB = reducer(newState, {
    //   payload: { key: 'firstName', valid: true, value: 'Ivan' },
    //   type: 'SET_IN_FORM'
    // });
    // expect(newStateB).toBe(newState);
  });

  it('Sets the errors state', async () => {
    const error = 'Length must be more than 3 characters';
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

    const Field = ({}) => {
      const { onChangeHandler, value } = useField({ initialValue: '', name, validator });

      return (
        <input
          data-test="input"
          type="text"
          onChange={(event) => onChangeHandler(event.target.value)}
          value={value}
        />
      );
    };

    const mockOnChange = jest.fn();

    const Component = () => (
      <FormRoot dataTest="root-form" onChange={mockOnChange} onSubmit={jest.fn()}>
        <FormObject name="user">
          <FormObject name="info">
            <Field />
          </FormObject>
        </FormObject>
      </FormRoot>
    );

    const { findByDataTest } = testRender(<Component />);

    await findByDataTest('input');

    const lastCall = mockOnChange.mock.calls.pop();

    expect(lastCall[0]).toEqual({
      errors: {
        'user.info.firstName': [
          {
            text: 'Length must be more than 3 characters'
          }
        ]
      },
      valid: false,
      value: { user: { info: { firstName: '' } } }
    });
  });
});
