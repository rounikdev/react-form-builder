import { FC, memo, MouseEventHandler } from 'react';

import { Stylable, Testable } from '@root/types';
import { useClass } from '@services';

import styles from './Button.scss';

interface ButtonProps extends Stylable, Testable {
  onClick: MouseEventHandler;
  text: string;
  type?: 'button' | 'submit';
  variant?: 'Edit' | 'Warn';
}

export const Button: FC<ButtonProps> = memo(
  ({ className, dataTest, onClick, text, type = 'button', variant }) => {
    return (
      <button
        className={useClass(
          [styles.Container, variant && styles[variant], className],
          [className, variant]
        )}
        data-test={dataTest}
        onClick={onClick}
        type={type}
      >
        {text}
      </button>
    );
  }
);