import { FC, StrictMode } from 'react';
import { Story, Meta } from '@storybook/react';

import { Button, Text } from '@ui';

import { ConditionalFields, FormArray, FormRoot, FormUser } from '../components';

import { FormStateDisplay, SubmitButton, UserForm } from './components';
import {
  createUser,
  initialUsers,
  passwordDependencyExtractor,
  passwordValidator,
  repeatPasswordValidator
} from './data';

import styles from './FormStories.scss';

export default {
  title: 'Demo/Form'
} as Meta;

const Template: Story<FC> = () => {
  return (
    <StrictMode>
      <section className={styles.Container}>
        <div className={styles.FormContainer}>
          <FormRoot
            className={styles.Form}
            dataTest="users"
            onSubmit={console.log}
            onReset={() => {
              console.log('Form reset');
            }}
          >
            <FormStateDisplay />
            <FormArray factory={createUser} initialValue={initialUsers} name="users">
              {([users, addUser, removeUser]) => {
                return (
                  <>
                    <FormUser>
                      {({ isEdit, isParentEdit }) => {
                        return isParentEdit && isEdit ? (
                          <div className={styles.AddUserContainer}>
                            <Button dataTest="add-user" onClick={addUser} text="Add User" />
                          </div>
                        ) : null;
                      }}
                    </FormUser>
                    {users.map((user, userIndex) => {
                      return (
                        <UserForm
                          key={user.id}
                          removeUser={removeUser}
                          user={user}
                          userIndex={userIndex}
                        />
                      );
                    })}
                  </>
                );
              }}
            </FormArray>
            <ConditionalFields hidden condition={(formData) => formData?.users?.length > 2}>
              <div className={styles.Passwords}>
                <Text
                  className={styles.PasswordInput}
                  dataTest="password"
                  disabled={false}
                  id="password"
                  initialValue="a"
                  label="Password"
                  name="password"
                  validator={passwordValidator}
                />
                <Text
                  className={styles.PasswordInput}
                  dataTest="repeat-password"
                  disabled={false}
                  dependencyExtractor={passwordDependencyExtractor}
                  id="repeat-password"
                  initialValue="af"
                  label="Repeat Password"
                  name="repeatPassword"
                  validator={repeatPasswordValidator}
                />
              </div>
            </ConditionalFields>
            <SubmitButton />
          </FormRoot>
        </div>
        <div className={styles.FormStateDisplay} id="form-state-display"></div>
      </section>
    </StrictMode>
  );
};

export const FormDemo = Template.bind({});
