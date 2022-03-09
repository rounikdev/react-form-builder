import { FC, StrictMode } from 'react';

import { ConditionalFields, FormArray, FormObject, FormRoot, FormUser } from '../components';

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
    <StrictMode>
      <section className={styles.Container}>
        <div className={styles.FormContainer}>
          <FormRoot
            className={styles.Form}
            dataTest="users-form"
            initialData={{ users: initialUsers, password: 'a', repeatPassword: 'af' }}
            onSubmit={console.log}
          >
            <FormStateDisplay />
            <FormArray factory={createUser} name="users">
              {([usersArray, addUser, removeUser]) => {
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
                              <div style={{ width: '100%', marginBottom: '1rem' }}>
                                <FormUser>
                                  {({ isEdit, methods }) => {
                                    return (
                                      <div>
                                        {!isEdit ? (
                                          <button onClick={methods.edit} type="button">
                                            Edit
                                          </button>
                                        ) : (
                                          <>
                                            <button onClick={methods.cancel} type="button">
                                              Cancel
                                            </button>
                                            <button onClick={methods.save} type="button">
                                              Save
                                            </button>
                                          </>
                                        )}
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
                                {([phonesArray, addPhone, removePhone]) => {
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
                                                    hidden
                                                    id={`id-phone-${userIndex}-${phoneIndex}`}
                                                    initialValue={phone.id}
                                                    name="id"
                                                  />
                                                  <TextInput
                                                    id={`phone-value-${userIndex}-${phoneIndex}`}
                                                    initialValue={phone.value}
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
