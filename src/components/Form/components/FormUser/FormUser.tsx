import { FC, memo } from 'react';

import { HeightTransitionBoxAuto, HeightTransitionProvider } from '../../../HeightTransitionBox';

import { useForm } from '../../hooks';
import { useFormData } from '../../providers';
import { FormUserProps } from '../../types';

import styles from './FormUser.scss';

export const FormUser: FC<FormUserProps> = memo(
  ({
    animate,
    animateDataTest,
    animateDuration,
    animateMemoizeChildren,
    children,
    className,
    contentClassName
  }) => {
    const { methods } = useForm();
    const { formData } = useFormData();

    return animate ? (
      <HeightTransitionProvider>
        <HeightTransitionBoxAuto
          className={className}
          contentClassName={contentClassName}
          dataTest={animateDataTest}
          memoizeChildren={animateMemoizeChildren}
          transitionDuration={animateDuration}
        >
          {children({ formData, hideClassName: styles.Hide, methods })}
        </HeightTransitionBoxAuto>
      </HeightTransitionProvider>
    ) : (
      children({ formData, hideClassName: styles.Hide, methods })
    );
  }
);

FormUser.displayName = 'FormUser';
