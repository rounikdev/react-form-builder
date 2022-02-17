import { FC } from 'react';

import { FormArray } from '../FormArray';
import { FormObject } from '../FormObject';
import { FormRoot } from '../FormRoot';
import { FormArrayFunctionArguments, FormStateEntryValue } from '../types';

import { FormStateDisplay, SubmitButton, TextInput } from './components';
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
};

type Users = typeof initialUsers;

type Phone = { id: string; value: string };

export const FormDemo: FC = () => {
  return (
    <section className={styles.Container}>
      <div className={styles.FormContainer}>
        <FormRoot
          className={styles.Form}
          dataTest="users-form"
          initialData={
            { users: initialUsers, password: 'a', repeatPassword: 'af' } as FormStateEntryValue
          }
          onSubmit={console.log}
        >
          <FormStateDisplay />
          <FormArray factory={createUser} name="users">
            {([usersArray, addUser, removeUser]: FormArrayFunctionArguments) => {
              return (
                <>
                  <button className={styles.AddUserButton} onClick={addUser} type="button">
                    Add User
                  </button>
                  {(usersArray as Users).map((user, userIndex) => {
                    return (
                      <div className={styles.Group} key={user.id}>
                        <div className={styles.User}>
                          <FormObject name={`${userIndex}`}>
                            <TextInput
                              className={styles.Input}
                              id={`first-name-${userIndex}`}
                              label="First Name"
                              name="firstName"
                              validator={nameValidator}
                            />
                            <TextInput
                              className={styles.Input}
                              id={`last-name-${userIndex}`}
                              label="Last Name"
                              name="lastName"
                              validator={nameValidator}
                            />

                            <FormArray factory={createPhone} name="phones">
                              {([
                                phonesArray,
                                addPhone,
                                removePhone
                              ]: FormArrayFunctionArguments) => {
                                return (
                                  <>
                                    <button
                                      className={styles.AddPhoneButton}
                                      onClick={addPhone}
                                      type="button"
                                    >
                                      Add Phone
                                    </button>
                                    <div className={styles.Phones}>
                                      <div className={styles.PhonesList}>
                                        {(phonesArray as Phone[]).map((phone, phoneIndex) => {
                                          return (
                                            <div className={styles.Phone} key={phone.id}>
                                              <FormObject name={`${phoneIndex}`}>
                                                <TextInput
                                                  id={`phone-value-${userIndex}-${phoneIndex}`}
                                                  label="Phone Number"
                                                  name="value"
                                                  validator={phoneValidator}
                                                />
                                              </FormObject>
                                              <button
                                                onClick={() => removePhone(phoneIndex)}
                                                type="button"
                                              >
                                                Remove Phone
                                              </button>
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
                        <button
                          className={styles.RemoveUserButton}
                          onClick={() => removeUser(userIndex)}
                          type="button"
                        >
                          Remove user
                        </button>
                      </div>
                    );
                  })}
                </>
              );
            }}
          </FormArray>
          <div className={styles.Passwords}>
            <TextInput
              className={styles.PasswordInput}
              id="password"
              label="Password"
              name="password"
              validator={passwordValidator}
            />

            <TextInput
              className={styles.PasswordInput}
              dependencyExtractor={passwordDependencyExtractor}
              id="repeat-password"
              label="Repeat Password"
              name="repeatPassword"
              validator={repeatPasswordValidator}
            />
          </div>
          <SubmitButton />
        </FormRoot>
      </div>
      <div className={styles.FormStateDisplay} id="form-state-display"></div>
    </section>
  );
};
