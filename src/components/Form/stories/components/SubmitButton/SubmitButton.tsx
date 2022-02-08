import { memo } from 'react';

import { useForm } from '@components';

import styles from './SubmitButton.scss';

const PlaygroundSubmitButton = () => {
  const context = useForm();

  return (
    <div className={styles.Container}>
      <button
        className={styles.Submit}
        onClick={() => {
          context.methods.forceValidate();
        }}
        type="submit"
      >{`Submit ${context.valid ? '- Valid' : '- Not valid'}`}</button>
      <button
        className={styles.Reset}
        onClick={() => {
          context.methods.reset();
        }}
        type="button"
      >
        Reset
      </button>
    </div>
  );
};

export default memo(PlaygroundSubmitButton);