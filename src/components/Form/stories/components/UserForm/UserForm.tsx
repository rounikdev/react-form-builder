import { FC, memo } from 'react';

import { FormArray, FormObject, FormUser } from '@components';
import { Button, TextInput } from '@ui';

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
    <div className={styles.Container} key={user.id} data-test={`user-${userIndex}`}>
      <div className={styles.User}>
        <FormObject name={`${userIndex}`}>
          <div className={styles.Controls}>
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
            dataTest={`id-user-${userIndex}`}
            hidden
            id={`id-user-${userIndex}`}
            initialValue={user.id}
            name="id"
          />
          <TextInput
            className={styles.Input}
            dataTest={`first-name-${userIndex}`}
            id={`first-name-${userIndex}`}
            initialValue={user.firstName}
            label="First Name"
            name="firstName"
            validator={nameValidator}
          />
          <TextInput
            className={styles.Input}
            dataTest={`last-name-${userIndex}`}
            id={`last-name-${userIndex}`}
            initialValue={user.lastName}
            label="Last Name"
            name="lastName"
            validator={nameValidator}
          />
          <FormArray factory={createPhone} initialValue={user.phones} name="phones">
            {([phones, addPhone, removePhone]) => {
              return (
                <div className={styles.Phones}>
                  <FormUser>
                    {({ isEdit }) => {
                      return isEdit ? (
                        <Button
                          className={styles.AddButton}
                          dataTest={`add-phone-user-${userIndex}`}
                          onClick={addPhone}
                          text="Add Phone"
                        />
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
