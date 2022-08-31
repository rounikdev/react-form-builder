import { FC, memo } from 'react';

import { FormArray, FormObject, FormUser, ValidityCheck } from '@core';
import { Button, ErrorField, Text } from '@ui';

import { createPhone, nameValidator, User } from '../../data';
import { PhoneForm } from '../PhoneForm/PhoneForm';

import styles from './UserForm.scss';

interface UserFormProps {
  removeUser: (index: number) => void;
  user: User;
  userIndex: number;
}

export const UserForm: FC<UserFormProps> = memo(({ removeUser, user, userIndex }) => {
  return (
    <div className={styles.Container} data-test={`user-${userIndex}`}>
      <div className={styles.User}>
        <FormObject name={`${userIndex}`} localEdit>
          <div className={styles.Controls}>
            <FormUser>
              {({ formContext: { isEdit, isParentEdit, methods } }) => {
                return isParentEdit ? (
                  <div>
                    {!isEdit ? (
                      <>
                        <Button
                          dataTest={`edit-user-${userIndex}`}
                          onClick={methods.edit}
                          text="Edit"
                          variant="Edit"
                        />
                        <Button
                          dataTest={`reset-user-${userIndex}`}
                          onClick={() => methods.reset()}
                          text="Reset"
                        />
                      </>
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
                ) : null;
              }}
            </FormUser>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text
              dataTest={`id-user-${userIndex}`}
              hidden
              id={`id-user-${userIndex}`}
              initialValue={user.id}
              name="id"
            />
            <Text
              className={styles.Input}
              dataTest={`first-name-${userIndex}`}
              id={`first-name-${userIndex}`}
              initialValue={user.firstName}
              label="First Name"
              name="firstName"
              validator={nameValidator}
            />
            <Text
              className={styles.Input}
              dataTest={`last-name-${userIndex}`}
              id={`last-name-${userIndex}`}
              initialValue={user.lastName}
              label="Last Name"
              name="lastName"
              validator={nameValidator}
            />
          </div>
          <FormArray
            dependencyExtractor={(formData) => {
              return formData?.users?.length ?? 0;
            }}
            factory={createPhone}
            initialValue={user.phones}
            localEdit
            name="phones"
            validator={async (phones, usersLength) => {
              let validityCheck: ValidityCheck = {
                errors: [],
                valid: true
              };

              await new Promise((resolve) => {
                setTimeout(() => {
                  if (phones.length < usersLength) {
                    validityCheck = {
                      errors: [{ text: `Enter at least ${usersLength} phones` }],
                      valid: false
                    };
                  }
                  resolve(null);
                }, 1000);
              });

              return validityCheck;
            }}
          >
            {([phones, addPhone, removePhone, errors, touched]) => {
              return (
                <div className={styles.Phones}>
                  <FormUser>
                    {({ formContext: { isEdit, isParentEdit } }) => {
                      return isParentEdit && isEdit ? (
                        <Button
                          className={styles.AddButton}
                          dataTest={`add-phone-user-${userIndex}`}
                          onClick={addPhone}
                          text="Add Phone"
                        />
                      ) : null;
                    }}
                  </FormUser>
                  <FormUser>
                    {({ formContext: { isEdit, isParentEdit, methods } }) => {
                      return isParentEdit ? (
                        <div>
                          {!isEdit ? (
                            <>
                              <Button
                                dataTest={`edit-user-${userIndex}-phones`}
                                onClick={methods.edit}
                                text="Edit"
                                variant="Edit"
                              />
                              <Button
                                dataTest={`reset-user-${userIndex}-phones`}
                                onClick={() => methods.reset()}
                                text="Reset"
                              />
                            </>
                          ) : (
                            <>
                              <Button
                                className={styles.CancelButton}
                                dataTest={`cancel-user-${userIndex}-phones`}
                                onClick={methods.cancel}
                                text="Cancel"
                              />
                              <Button
                                dataTest={`save-user-${userIndex}-phones`}
                                onClick={methods.save}
                                text="Save"
                              />
                            </>
                          )}
                        </div>
                      ) : null;
                    }}
                  </FormUser>
                  <div className={styles.PhonesList}>
                    {phones.map((phone, phoneIndex) => {
                      return (
                        <PhoneForm
                          key={phone.id}
                          phone={phone}
                          phoneIndex={phoneIndex}
                          removePhone={removePhone}
                          userIndex={userIndex}
                        />
                      );
                    })}
                    <ErrorField
                      dataTest={`errors-user-${userIndex}-phones`}
                      errors={errors}
                      isError={touched}
                    />
                  </div>
                </div>
              );
            }}
          </FormArray>
        </FormObject>
      </div>
    </div>
  );
});

UserForm.displayName = 'UserForm';
