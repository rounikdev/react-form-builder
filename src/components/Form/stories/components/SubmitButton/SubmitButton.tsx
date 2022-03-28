import { memo } from 'react';

import { useForm } from '@components/Form/hooks';
import { Button } from '@ui';

import styles from './SubmitButton.scss';

const SubmitButton = () => {
  const context = useForm();

  return (
    <div className={styles.Container}>
      <Button
        dataTest="submit"
        onClick={context.methods.forceValidate}
        type="submit"
        text="Submit"
        variant={context.valid ? undefined : 'Warn'}
      />
      <Button dataTest="reset" onClick={context.methods.reset} text="Reset" />
    </div>
  );
};

export default memo(SubmitButton);
