import { FC, Fragment, memo, useCallback, useMemo, useRef } from 'react';

import { useClass, useUpdate } from '@rounik/react-custom-hooks';

import { useTranslation } from '@components';

import { useCombobox } from '../../Autocomplete';
import { OptionProps } from '../../types';

import styles from './Option.scss';

export const Option: FC<OptionProps> = memo(({ className, dataTest, id, text, substitutes }) => {
  const { close, focused, opened, select, selected } = useCombobox();

  const { translate } = useTranslation();

  const element = useRef<HTMLLIElement>(null);

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

  useUpdate(() => {
    if (opened && id === focused) {
      element.current?.focus();
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
        close();
      }, [close, id, select])}
      onKeyUp={useCallback(
        (event) => {
          if (event.code === 'Enter') {
            select(id);
            close();
          }
        },
        [close, id, select]
      )}
      ref={element}
      role="option"
    >
      {label}
    </li>
  );
});

Option.displayName = 'Option';
