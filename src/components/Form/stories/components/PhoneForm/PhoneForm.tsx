import { FC, memo } from 'react';

import { FormObject, FormUser } from '@components';
import { Button, TextInput } from '@ui';

import { Phone, phoneValidator } from '../../data';

import styles from './PhoneForm.scss';

interface PhoneFormProps {
  phone: Phone;
  phoneIndex: number;
  removePhone: (index: number) => void;
  userIndex: number;
}

export const PhoneForm: FC<PhoneFormProps> = memo(
  ({ phone, phoneIndex, removePhone, userIndex }) => {
    return (
      <div className={styles.Container} key={phone.id}>
        <FormObject name={`${phoneIndex}`}>
          <TextInput
            dataTest={`id-phone-${userIndex}-${phoneIndex}`}
            hidden
            id={`id-phone-${userIndex}-${phoneIndex}`}
            initialValue={phone.id}
            name="id"
          />
          <TextInput
            className={styles.Input}
            dataTest={`phone-value-${userIndex}-${phoneIndex}`}
            id={`phone-value-${userIndex}-${phoneIndex}`}
            initialValue={phone.value}
            label="Phone Number"
            name="value"
            validator={phoneValidator}
          />
        </FormObject>
        <FormUser>
          {({ isEdit }) => {
            return isEdit ? (
              <Button
                dataTest={`remove-phone-${userIndex}-${phoneIndex}`}
                onClick={() => removePhone(phoneIndex)}
                text="X"
                variant="Warn"
              />
            ) : null;
          }}
        </FormUser>
      </div>
    );
  }
);

PhoneForm.displayName = 'PhoneForm';
