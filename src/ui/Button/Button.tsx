import { FC, memo, MouseEventHandler, ReactNode } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { Stylable, Testable } from '@types';

import styles from './Button.scss';

interface ButtonProps extends Stylable, Testable {
  disabled?: boolean;
  label?: string;
  onClick: MouseEventHandler;
  text: ReactNode;
  type?: 'button' | 'submit';
  variant?: 'Edit' | 'Warn';
}

export const Button: FC<ButtonProps> = memo(
  ({ className, dataTest, disabled, label, onClick, text, type = 'button', variant }) => {
    return (
      <button
        aria-label={label}
        className={useClass(
          [styles.Container, variant && styles[variant], className],
          [className, variant]
        )}
        data-test={dataTest}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {text}
      </button>
    );
  }
);
