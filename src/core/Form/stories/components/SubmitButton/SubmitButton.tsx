import { memo } from 'react';

import { FormUser, useForm, useFormRoot } from '@core';
import { Button } from '@ui';

import styles from './SubmitButton.scss';

const SubmitButton = () => {
  const context = useForm();
  const rootContext = useFormRoot();

  return (
    <div className={styles.Container}>
      <Button
        dataTest="submit"
        onClick={() => context.methods.forceValidate()}
        type="submit"
        text="Submit"
        variant={context.valid ? undefined : 'Warn'}
      />
      <Button dataTest="reset" onClick={() => context.methods.reset()} text="Reset" />
      <Button
        dataTest="reset-list"
        onClick={() => rootContext.methods.reset({ resetList: ['users.0.phones'] })}
        text="Reset users.0.phones"
      />
      <FormUser>
        {({ formContext: { isEdit, methods } }) => {
          return (
            <div>
              {!isEdit ? (
                <Button dataTest={`edit-form`} onClick={methods.edit} text="Edit" />
              ) : (
                <>
                  {' '}
                  <Button dataTest={`cancel-form`} onClick={methods.cancel} text="Cancel" />{' '}
                  <Button dataTest={`save-form`} onClick={methods.save} text="Save" />
                </>
              )}
            </div>
          );
        }}
      </FormUser>
    </div>
  );
};

export default memo(SubmitButton);
