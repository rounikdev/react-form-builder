/* eslint-disable max-len */
import { FC, StrictMode } from 'react';
import { Story, Meta } from '@storybook/react';

import { Button, TextInput } from '@ui';

import { ConditionalFields, FormArray, FormObject, FormRoot, FormUser } from '../components';

import { FormStateDisplay, SubmitButton } from './components';
import {
  createPhone,
  createUser,
  initialUsers,
  nameValidator,
  passwordDependencyExtractor,
  passwordValidator,
  phoneValidator,
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
          <FormRoot className={styles.Form} dataTest="users-form" onSubmit={console.log}>
            <FormStateDisplay />
            <FormArray factory={createUser} initialValue={initialUsers} name="users">
              {([users, addUser, removeUser]) => {
                return (
                  <>
                    <div className={styles.AddUserContainer}>
                      <Button dataTest="add-user" onClick={addUser} text="Add User" />
                    </div>
                    {users.map((user, userIndex) => {
                      return (
                        <div className={styles.Group} key={user.id} data-test={`user-${userIndex}`}>
                          <div className={styles.User}>
                            <FormObject name={`${userIndex}`}>
                              <div style={{ width: '100%', marginBottom: '1rem' }}>
                                <FormUser>
                                  {({ isEdit, methods }) => {
                                    return (
                                      <div>
                                        {!isEdit ? (
                                          <Button
                                            dataTest={`edit-user-${userIndex}`}
                                            onClick={methods.edit}
                                            text="Edit"
                                            variant="Edit"
                                          />
                                        ) : (
                                          <>
                                            <Button
                                              dataTest={`cancel-user-${userIndex}`}
                                              onClick={methods.cancel}
                                              text="Cancel"
                                            />
                                            <Button
                                              dataTest={`save-user-${userIndex}`}
                                              onClick={methods.save}
                                              text="Save"
                                            />
                                          </>
                                        )}
                                        <Button
                                          dataTest={`remove-user-${userIndex}`}
                                          onClick={() => removeUser(userIndex)}
                                          text="Remove"
                                          variant="Warn"
                                        />
                                      </div>
                                    );
                                  }}
                                </FormUser>
                              </div>
                              <TextInput
                                hidden
                                id={`id-user-${userIndex}`}
                                initialValue={user.id}
                                name="id"
                              />
                              <TextInput
                                className={styles.Input}
                                id={`first-name-${userIndex}`}
                                initialValue={user.firstName}
                                label="First Name"
                                name="firstName"
                                validator={nameValidator}
                              />
                              <TextInput
                                className={styles.Input}
                                id={`last-name-${userIndex}`}
                                initialValue={user.lastName}
                                label="Last Name"
                                name="lastName"
                                validator={nameValidator}
                              />

                              <FormArray
                                factory={createPhone}
                                initialValue={user.phones}
                                name="phones"
                              >
                                {([phones, addPhone, removePhone]) => {
                                  return (
                                    <>
                                      <div className={styles.Phones}>
                                        <Button
                                          className={styles.AddButton}
                                          dataTest={`add-phone-user-${userIndex}`}
                                          onClick={addPhone}
                                          text="Add Phone"
                                        />
                                        <div className={styles.PhonesList}>
                                          {phones.map((phone, phoneIndex) => {
                                            return (
                                              <div className={styles.Phone} key={phone.id}>
                                                <FormObject name={`${phoneIndex}`}>
                                                  <TextInput
                                                    hidden
                                                    id={`id-phone-${userIndex}-${phoneIndex}`}
                                                    initialValue={phone.id}
                                                    name="id"
                                                  />
                                                  <TextInput
                                                    className={styles.PhoneInput}
                                                    id={`phone-value-${userIndex}-${phoneIndex}`}
                                                    initialValue={phone.value}
                                                    label="Phone Number"
                                                    name="value"
                                                    validator={phoneValidator}
                                                  />
                                                </FormObject>
                                                <Button
                                                  dataTest={`remove-phone-${userIndex}-${phoneIndex}`}
                                                  onClick={() => removePhone(phoneIndex)}
                                                  text="X"
                                                  variant="Warn"
                                                />
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </>
                                  );
                                }}
                              </FormArray>
                            </FormObject>
                          </div>
                        </div>
                      );
                    })}
                  </>
                );
              }}
            </FormArray>
            <ConditionalFields condition={(formData) => formData?.users?.length > 2}>
              <div className={styles.Passwords}>
                <TextInput
                  className={styles.PasswordInput}
                  id="password"
                  initialValue="a"
                  label="Password"
                  name="password"
                  validator={passwordValidator}
                />
                <TextInput
                  className={styles.PasswordInput}
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
