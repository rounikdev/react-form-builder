import { FC, memo } from 'react';

import { HeightTransitionBoxAuto, HeightTransitionProvider } from '../../../HeightTransitionBox';

import { useForm } from '../../hooks';
import { useFormRoot } from '../../providers';
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
    const { isEdit, isParentEdit, localEdit, methods } = useForm();
    const { formData } = useFormRoot();

    return animate ? (
      <HeightTransitionProvider>
        <HeightTransitionBoxAuto
          className={className}
          contentClassName={contentClassName}
          dataTest={animateDataTest}
          memoizeChildren={animateMemoizeChildren}
          transitionDuration={animateDuration}
        >
          {children({
            formData,
            hideClassName: styles.Hide,
            isEdit,
            isParentEdit,
            localEdit,
            methods
          })}
        </HeightTransitionBoxAuto>
      </HeightTransitionProvider>
    ) : (
      children({ formData, hideClassName: styles.Hide, isEdit, isParentEdit, localEdit, methods })
    );
  }
);

FormUser.displayName = 'FormUser';
