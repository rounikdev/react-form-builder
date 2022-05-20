import { FC, memo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useAccordion } from './hooks';
import { AccordionProps } from './types';

import styles from './Accordion.scss';

export const Accordion: FC<AccordionProps> = memo(
  ({
    children,
    className,
    dataTest,
    disabled = false,
    id,
    keepMounted = false,
    keepOpened = false,
    opened = false,
    renderHeader
  }) => {
    const {
      close,
      content,
      contentElement,
      height,
      hiddenContent,
      isOpen,
      onTransitionEndHandler,
      open
    } = useAccordion({
      children,
      disabled,
      id,
      keepMounted,
      keepOpened,
      opened
    });

    let element = null;

    if (keepMounted) {
      element = <div ref={hiddenContent}>{contentElement}</div>;
    } else {
      if (isOpen && height === 0) {
        element = (
          <div aria-hidden={true} key="cache" className={styles.Hidden} ref={hiddenContent}>
            {children}
          </div>
        );
      } else {
        element = <div key="cache">{contentElement}</div>;
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
          className={styles.Content}
          id={`${id}-content`}
          onTransitionEnd={onTransitionEndHandler}
          ref={content}
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
