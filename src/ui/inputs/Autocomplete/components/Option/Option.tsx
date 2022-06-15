import { forwardRef, Fragment, memo, RefObject, useCallback, useMemo } from 'react';

import { useClass, useUpdateOnly } from '@rounik/react-custom-hooks';

import { useComboBox, useTranslation } from '@core';

import { OptionProps } from '../../types';

import styles from './Option.scss';

export const Option = memo(
  forwardRef<HTMLLIElement, OptionProps>(({ className, dataTest, id, text, substitutes }, ref) => {
    const { close, focused, multi, opened, select, selected } = useComboBox();

    const { translate } = useTranslation();

    const label = useMemo(() => {
      let translation = translate(text, substitutes);

      if (Array.isArray(translation)) {
        translation = translation.map((el, index) => {
          return <Fragment key={index}>{el}</Fragment>;
        });
      }

      return translation;
    }, [substitutes, text, translate]);

    const isSelected = useMemo(() => {
      return selected.includes(id);
    }, [selected, id]);

    useUpdateOnly(() => {
      if (opened && id === focused) {
        (ref as RefObject<HTMLLIElement>).current?.focus();
      }
    }, [opened, focused]);

    return (
      <li
        tabIndex={-1}
        aria-selected={isSelected}
        className={useClass(
          [styles.Container, isSelected && styles.Selected, className],
          [className, isSelected]
        )}
        data-test={`${dataTest}-option`}
        id={`${id}-option`}
        onClick={useCallback(() => {
          select(id);

          if (!multi) {
            close();
          }
        }, [close, id, multi, select])}
        onKeyUp={useCallback(
          (event) => {
            if (event.code === 'Enter') {
              select(id);

              if (!multi) {
                close();
              }
            }
          },
          [close, id, multi, select]
        )}
        ref={ref}
        role="option"
      >
        {label}
      </li>
    );
  })
);

Option.displayName = 'Option';
