import userEvent from '@testing-library/user-event';

import { TestButton, testRender, TestTextInput } from '@services/utils';

import { Form } from '../Form';
import { FormArrayChildrenArguments, FormStateEntryValue } from '../types';

export const testData = {
  users: [
    {
      id: '1',
      firstName: 'Maria',
      lastName: 'Ignatova'
    },
    {
      id: '2',
      firstName: 'Ivan',
      lastName: 'Ivanov'
    }
  ]
};

interface User {
  firstName: string;
  id: string;
  lastName: string;
}

export const createUser = () => ({
  firstName: '',
  id: `${new Date().getTime()}`,
  lastName: ''
});

const Component = ({
  initialData,
  factory
}: {
  initialData?: FormStateEntryValue;
  factory?: () => void;
}) => (
  <Form dataTest="users-form" formTag initialData={initialData} onSubmit={console.log}>
    <Form factory={factory} name="users" type="array">
      {([usersArray, addUser, removeUser]: FormArrayChildrenArguments) => {
        return (
          <>
            <TestButton dataTest="add-user" onClick={() => addUser()} text="Add user" />
            {(usersArray as User[]).map((user, userIndex) => {
              return (
                <div key={user.id} data-test="user">
                  <Form name={`${userIndex}`}>
                    <TestTextInput dataTestInput={`firstName-${userIndex}`} name="firstName" />
                    <TestTextInput dataTestInput={`lastName-${userIndex}`} name="lastName" />
                  </Form>
                  <TestButton
                    dataTest={`remove-user-${userIndex}`}
                    onClick={() => removeUser(userIndex)}
                    text="Remove user"
                  />
                </div>
              );
            })}
          </>
        );
      }}
    </Form>
  </Form>
);

describe('FormArrayWrapper', () => {
  it('Displays arrays correctly', () => {
    const { getAllByDataTest, getByDataTest } = testRender(<Component initialData={testData} />);

    expect(getAllByDataTest('user').length).toBe(testData.users.length);
    expect(getByDataTest(`firstName-0`)).toHaveValue(testData.users[0].firstName);
    expect(getByDataTest(`lastName-0`)).toHaveValue(testData.users[0].lastName);
    expect(getByDataTest(`firstName-1`)).toHaveValue(testData.users[1].firstName);
    expect(getByDataTest(`lastName-1`)).toHaveValue(testData.users[1].lastName);
  });

  it('Displays empty array of items when no initialData', () => {
    const { queryAllByDataTest } = testRender(<Component />);

    expect(queryAllByDataTest('user').length).toBe(0);
  });

  it('Shows the right items after removing an item', () => {
    const { getAllByDataTest, getByDataTest } = testRender(<Component initialData={testData} />);

    userEvent.click(getByDataTest('remove-user-0-button'));

    expect(getAllByDataTest('user').length).toBe(1);
    expect(getByDataTest(`firstName-0`)).toHaveValue(testData.users[1].firstName);
    expect(getByDataTest(`lastName-0`)).toHaveValue(testData.users[1].lastName);
  });

  it('Shows the right items after adding new item', () => {
    const { getAllByDataTest, getByDataTest } = testRender(
      <Component initialData={testData} factory={createUser} />
    );

    userEvent.click(getByDataTest('add-user-button'));

    expect(getAllByDataTest('user').length).toBe(testData.users.length + 1);
    expect(getByDataTest(`firstName-0`)).toHaveValue(testData.users[0].firstName);
    expect(getByDataTest(`lastName-0`)).toHaveValue(testData.users[0].lastName);
    expect(getByDataTest(`firstName-1`)).toHaveValue(testData.users[1].firstName);
    expect(getByDataTest(`lastName-1`)).toHaveValue(testData.users[1].lastName);
    expect(getByDataTest(`firstName-2`)).toHaveValue('');
    expect(getByDataTest(`lastName-2`)).toHaveValue('');
  });

  it('Shows the right items after trying to add new item but without providing a factory', () => {
    const { getAllByDataTest, getByDataTest } = testRender(<Component initialData={testData} />);

    userEvent.click(getByDataTest('add-user-button'));

    expect(getAllByDataTest('user').length).toBe(testData.users.length);
    expect(getByDataTest(`firstName-0`)).toHaveValue(testData.users[0].firstName);
    expect(getByDataTest(`lastName-0`)).toHaveValue(testData.users[0].lastName);
    expect(getByDataTest(`firstName-1`)).toHaveValue(testData.users[1].firstName);
    expect(getByDataTest(`lastName-1`)).toHaveValue(testData.users[1].lastName);
  });

  it('Renders children when not provided as "function as children"', () => {
    const { getAllByDataTest, getByDataTest } = testRender(
      <Form dataTest="users" initialData={testData} formTag onSubmit={console.log}>
        <Form name="users" type="array">
          {(testData.users as User[]).map((user, userIndex) => {
            return (
              <div key={user.id} data-test="user">
                <Form name={`${userIndex}`}>
                  <TestTextInput dataTestInput={`firstName-${userIndex}`} name="firstName" />
                  <TestTextInput dataTestInput={`lastName-${userIndex}`} name="lastName" />
                </Form>
              </div>
            );
          })}
        </Form>
      </Form>
    );

    expect(getAllByDataTest('user').length).toBe(testData.users.length);
    expect(getByDataTest(`firstName-0`)).toHaveValue(testData.users[0].firstName);
    expect(getByDataTest(`lastName-0`)).toHaveValue(testData.users[0].lastName);
    expect(getByDataTest(`firstName-1`)).toHaveValue(testData.users[1].firstName);
    expect(getByDataTest(`lastName-1`)).toHaveValue(testData.users[1].lastName);
  });
});
