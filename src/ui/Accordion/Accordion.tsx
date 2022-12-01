import { FC, memo, SyntheticEvent, useCallback, useRef, useState } from 'react';

import { useClass, useLayoutUpdate } from '@rounik/react-custom-hooks';

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
    scrollAfterOpenAuto,
    scrollAfterOpenManual
  }) => {
    const {
      close,
      content,
      contentWrapperRef,
      height,
      hiddenContent,
      isOpen,
      isOpenImperativeRef,
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

    const [overflow, setOverflow] = useState(false);

    const onTransitionEnd = useCallback(
      (e: SyntheticEvent) => {
        /* istanbul ignore next */
        if (e.target !== contentWrapperRef.current) {
          return;
        }

        onTransitionEndHandler();

        if (isOpen) {
          setOverflow(true);

          if (scrollAfterOpenAuto && !scrollAfterOpenManual) {
            headerRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });

            isOpenImperativeRef.current = false;
          }
        } else {
          setOverflow(false);
        }

        if (scrollAfterOpenManual && !scrollAfterOpenAuto && isOpenImperativeRef.current) {
          headerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });

          isOpenImperativeRef.current = false;
        }
      },
      [
        contentWrapperRef,
        isOpen,
        isOpenImperativeRef,
        onTransitionEndHandler,
        scrollAfterOpenAuto,
        scrollAfterOpenManual
      ]
    );

    let element = null;

    if (keepMounted) {
      element = (
        <div className={styles.HiddenContent} ref={hiddenContent}>
          {content}
        </div>
      );
    } else {
      if (isOpen && height === 0) {
        element = (
          <div aria-hidden={true} className={styles.HiddenContent} key="cache" ref={hiddenContent}>
            {children}
          </div>
        );
      } else {
        element = (
          <div className={styles.HiddenContent} key="cache">
            {content}
          </div>
        );
      }
    }

    useLayoutUpdate(() => {
      if (isOpen === false) {
        setOverflow(false);
      }
    }, [isOpen]);

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
            [styles.Content, overflow && styles.Open, isOpen && classNameOnContentOpen],
            [classNameOnContentOpen, isOpen, overflow]
          )}
          id={`${id}-content`}
          onTransitionEnd={onTransitionEnd}
          ref={contentWrapperRef}
          role="region"
          style={{ height }}
        >
          {animateOnContentChange ? (
            <HeightTransitionBox dataTest={`${dataTest}-content`}>{element}</HeightTransitionBox>
          ) : (
            element
          )}
        </div>
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';
