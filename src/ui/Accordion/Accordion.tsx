import { FC, memo, useCallback, useState } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useAccordion } from './hooks';
import { AccordionProps } from './types';

import styles from './Accordion.scss';

export const Accordion: FC<AccordionProps> = memo(
  ({
    children,
    className,
    dataTest,
    disabled,
    excludeFromGroup,
    id,
    keepMounted,
    onChange,
    opened,
    renderHeader
  }) => {
    const {
      close,
      content,
      contentWrapperRef,
      height,
      hiddenContent,
      isOpen,
      onTransitionEndHandler,
      open
    } = useAccordion({
      children,
      disabled,
      excludeFromGroup,
      id,
      keepMounted,
      onChange,
      opened
    });

    const [overflow, setOverflow] = useState(opened);

    let element = null;

    if (keepMounted) {
      element = <div ref={hiddenContent}>{content}</div>;
    } else {
      if (isOpen && height === 0) {
        element = (
          <div aria-hidden={true} key="cache" className={styles.Hidden} ref={hiddenContent}>
            {children}
          </div>
        );
      } else {
        element = <div key="cache">{content}</div>;
      }
    }

    return (
      <div
        className={useClass(
          [styles.Container, isOpen && styles.Opened, className],
          [isOpen, className]
        )}
        data-test={dataTest}
      >
        <div className={styles.Header}>{renderHeader({ close, disabled, id, isOpen, open })}</div>
        <div
          aria-labelledby={`${id}-header`}
          className={useClass(
            [styles.Content, isOpen && overflow && styles.Open],
            [isOpen, overflow]
          )}
          id={`${id}-content`}
          onTransitionEnd={useCallback(() => {
            onTransitionEndHandler();

            if (isOpen) {
              setOverflow(true);
            } else {
              setOverflow(false);
            }
          }, [isOpen, onTransitionEndHandler])}
          ref={contentWrapperRef}
          role="region"
          style={{ height }}
        >
          {element}
        </div>
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';
