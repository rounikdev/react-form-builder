import { FC } from 'react';

import { Form } from '../Form';
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
        <Form
          className={styles.Form}
          dataTest="users-form"
          formTag
          initialData={
            { users: initialUsers, password: 'a', repeatPassword: 'af' } as FormStateEntryValue
          }
          onSubmit={console.log}
        >
          <FormStateDisplay />
          <Form factory={createUser} name="users" type="array">
            {([usersArray, addUser, removeUser]: FormArrayFunctionArguments) => {
              return (
                <>
                  <button className={styles.AddUserButton} onClick={() => addUser()}>
                    Add User
                  </button>
                  {(usersArray as Users).map((user, userIndex) => {
                    return (
                      <div className={styles.Group} key={user.id}>
                        <div className={styles.User}>
                          <Form name={`${userIndex}`}>
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

                            <Form factory={createPhone} name="phones" type="array">
                              {([
                                phonesArray,
                                addPhone,
                                removePhone
                              ]: FormArrayFunctionArguments) => {
                                return (
                                  <>
                                    <button
                                      className={styles.AddPhoneButton}
                                      onClick={() => addPhone()}
                                    >
                                      Add Phone
                                    </button>
                                    <div className={styles.Phones}>
                                      <div className={styles.PhonesList}>
                                        {(phonesArray as Phone[]).map((phone, phoneIndex) => {
                                          return (
                                            <div className={styles.Phone} key={phone.id}>
                                              <Form name={`${phoneIndex}`}>
                                                <TextInput
                                                  id={`phone-value-${userIndex}-${phoneIndex}`}
                                                  label="Phone Number"
                                                  name="value"
                                                  validator={phoneValidator}
                                                />
                                              </Form>
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
                            </Form>
                          </Form>
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
          </Form>
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
        </Form>
      </div>
      <div className={styles.FormStateDisplay} id="form-state-display"></div>
    </section>
  );
};
