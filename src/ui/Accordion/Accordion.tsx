import { FC, memo, SyntheticEvent, useCallback, useRef, useState } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { HeightTransitionBox } from '@core';

import { useAccordion } from './hooks';
import { AccordionProps } from './types';

import styles from './Accordion.scss';

export const Accordion: FC<AccordionProps> = memo(
  ({
    animateOnContentChange,
    children,
    className,
    classNameOnContentOpen,
    dataTest,
    disabled,
    excludeFromGroup,
    id,
    keepMounted,
    onChange,
    opened,
    renderHeader,
    scrollOnOpenEnd
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

    const headerRef = useRef<null | HTMLDivElement>(null);

    const [overflow, setOverflow] = useState(opened);

    const onTransitionEnd = useCallback(
      (e: SyntheticEvent) => {
        if (e.target !== contentWrapperRef.current) {
          return;
        }

        onTransitionEndHandler();

        if (isOpen) {
          setOverflow(true);

          if (scrollOnOpenEnd) {
            headerRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        } else {
          setOverflow(false);
        }
      },
      [contentWrapperRef, isOpen, onTransitionEndHandler, scrollOnOpenEnd]
    );

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
        <div ref={headerRef} className={styles.Header}>
          {renderHeader({ close, disabled, id, isOpen, open })}
        </div>
        <div
          aria-labelledby={`${id}-header`}
          className={useClass(
            [styles.Content, isOpen && overflow && styles.Open, isOpen && classNameOnContentOpen],
            [classNameOnContentOpen, isOpen, overflow]
          )}
          id={`${id}-content`}
          onTransitionEnd={onTransitionEnd}
          ref={contentWrapperRef}
          role="region"
          style={{ height }}
        >
          {animateOnContentChange ? <HeightTransitionBox>{element}</HeightTransitionBox> : element}
        </div>
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';
