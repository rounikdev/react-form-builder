import { Meta, Story } from '@storybook/react';
import { FC, StrictMode } from 'react';

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
            onChange={console.log}
            onReset={() => {
              console.log('Form reset');
            }}
            onSubmit={console.log}
          >
            <FormStateDisplay />
            <FormArray factory={createUser} initialValue={initialUsers} name="users">
              {([users, addUser, removeUser]) => {
                return (
                  <>
                    <FormUser>
                      {({ formContext: { isEdit, isParentEdit } }) => {
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
                  dataTest="age"
                  disabled={false}
                  id="age"
                  label="Age"
                  name="age"
                  dependencyExtractor={(formData) => {
                    return formData.password;
                  }}
                  formatter={({ dependencyValue, newValue }) => {
                    let value: string = newValue;

                    if (dependencyValue) {
                      value = value.toUpperCase();
                    } else {
                      value = value.toLowerCase();
                    }

                    return value;
                  }}
                  required={(password) => !!password}
                />
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
            <FormUser>
              {({ formRootContext }) => {
                return (
                  <div>
                    <Button
                      dataTest="force-validate-selected"
                      onClick={() => {
                        formRootContext.methods.forceValidate({
                          repeatPassword: true,
                          'users.2.firstName': true
                        });
                      }}
                      text="Force validate selected fields"
                    />
                    <Button
                      dataTest="set-selected-to-un-touched"
                      onClick={() => {
                        formRootContext.methods.forceValidate({
                          repeatPassword: false,
                          'users.2.firstName': false
                        });
                      }}
                      text="Make selected fields not-touched"
                    />
                  </div>
                );
              }}
            </FormUser>
          </FormRoot>
        </div>
        <div className={styles.FormStateDisplay} id="form-state-display"></div>
      </section>
    </StrictMode>
  );
};

export const FormDemo = Template.bind({});
