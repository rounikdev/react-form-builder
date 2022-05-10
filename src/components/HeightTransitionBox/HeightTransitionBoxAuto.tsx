import { FC, memo, useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  useLastDiffValue,
  useMutationObserver,
  useUpdateOnly,
  useWindowResize
} from '@rounik/react-custom-hooks';

import { useHeightTransition } from './HeightTransitionProvider';
import { HeightTransitionBoxProps } from './types';

const MUTATION_OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
};

const DEBOUNCE_TIME = 200;

export const HeightTransitionBoxAuto: FC<HeightTransitionBoxProps> = memo(
  ({
    children,
    className,
    contentClassName,
    dataTest,
    memoizeChildren,
    onTransitionEnd,
    transitionDuration,
    transitionType
  }) => {
    const { shouldForceUpdate } = useHeightTransition();

    const contentRef = useRef<HTMLDivElement>(null);

    const [, setRender] = useState({});
    const [renderChildren, setRenderChildren] = useState(children);
    const [isInTransition, setIsInTransition] = useState(false);

    const prevChildren = useLastDiffValue(children);

    const observerCallback = useCallback(() => {
      setRender({});
    }, []);

    useMutationObserver({
      callback: observerCallback,
      config: MUTATION_OBSERVER_CONFIG,
      target: contentRef
    });

    useWindowResize({ callback: observerCallback, debounceTime: DEBOUNCE_TIME });

    // Handles nested transitions like
    // ErrorFields of ConditionalFields
    useLayoutEffect(() => {
      observerCallback();
    }, [observerCallback, shouldForceUpdate]);

    useUpdateOnly(() => {
      if (memoizeChildren) {
        if (!children && prevChildren) {
          setRenderChildren(prevChildren);
        } else {
          setRenderChildren(children);
        }

        setIsInTransition(true);
      }
    }, [children, prevChildren]);

    useUpdateOnly(() => {
      if (contentRef.current?.offsetHeight !== undefined) {
        setIsInTransition(true);
      }
    }, [contentRef.current?.offsetHeight]);

    let height = 0;

    if (memoizeChildren) {
      height = !children && prevChildren ? 0 : contentRef.current?.offsetHeight ?? 0;
    } else {
      height = contentRef.current?.offsetHeight ?? 0;
    }

    return (
      <div
        className={className}
        data-test={`${dataTest}-heightTransition-container`}
        onTransitionEnd={(event) => {
          event.stopPropagation();

          if (event.propertyName == 'height') {
            setIsInTransition(false);

            if (memoizeChildren && !children && prevChildren) {
              setRenderChildren(children);
            }

            if (onTransitionEnd) {
              onTransitionEnd(event);
            }

            observerCallback();
          }
        }}
        style={{
          height,
          overflow: isInTransition ? 'hidden' : 'unset',
          transition: `height ${
            typeof transitionDuration !== 'undefined' ? `${transitionDuration}ms` : '300ms'
          } ${typeof transitionType !== 'undefined' ? transitionType : 'ease-in-out'}`
        }}
      >
        <div
          data-test={`${dataTest}-heightTransition-content`}
          className={contentClassName}
          ref={contentRef}
        >
          {memoizeChildren ? renderChildren : children}
        </div>
      </div>
    );
  }
);

HeightTransitionBoxAuto.displayName = 'HeightTransitionBoxAuto';
