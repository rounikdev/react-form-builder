import { FC, forwardRef, memo, MutableRefObject, useCallback, useRef, useState } from 'react';

import {
  useLastDiffValue,
  useMutationObserver,
  useUpdateOnlyExtended,
  useUpdateSync,
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

export const HeightTransitionBox: FC<HeightTransitionBoxProps> = memo(
  forwardRef(
    (
      {
        children,
        className,
        contentClassName,
        dataTest,
        isRoot,
        memoizeChildren,
        noOverflowAuto,
        onTransitionEnd,
        style,
        transitionDuration,
        transitionType
      },
      ref
    ) => {
      const {
        actions: { forceUpdate },
        shouldForceUpdate
      } = useHeightTransition();

      const contentRef = useRef<HTMLDivElement>(null);

      const [, forceRender] = useState({});
      const [renderChildren, setRenderChildren] = useState(children);

      const prevChildren = useLastDiffValue(children);

      const observerCallback = useCallback(() => {
        forceRender({});

        if (!isRoot) {
          forceUpdate();
        }
      }, [forceUpdate, isRoot]);

      useMutationObserver({
        callback: observerCallback,
        config: MUTATION_OBSERVER_CONFIG,
        target: contentRef
      });

      useWindowResize({ callback: observerCallback, debounceTime: DEBOUNCE_TIME });

      // TODO: StrictMode check!
      // Handles nested transitions like
      // ErrorFields of ConditionalFields
      useUpdateOnlyExtended(() => {
        if (isRoot) {
          observerCallback();
        }
      }, [isRoot, observerCallback, shouldForceUpdate]);

      useUpdateOnlyExtended(() => {
        if (memoizeChildren) {
          if (!children && prevChildren) {
            setRenderChildren(prevChildren);
          } else {
            setRenderChildren(children);
          }
        }
      }, [children, prevChildren]);

      // Create `isTransitioningRef` to track the transitioning phase
      const isTransitioningRef = useRef(false);

      // Declare and initialize height
      // This is not done in a hook to prevent rendering skip
      let height = contentRef.current?.offsetHeight ?? 0;
      const prevHeight = useLastDiffValue(contentRef.current?.offsetHeight);

      // Set `height` to 0
      if (memoizeChildren && prevHeight !== undefined && !children && prevChildren) {
        height = 0;
      }

      // If there is a height diff allow transitioning
      useUpdateSync(() => {
        isTransitioningRef.current = true;
      }, height);

      useUpdateOnlyExtended(() => {
        forceRender({});
      }, [contentRef.current?.offsetHeight, contentRef.current?.scrollHeight]);

      return (
        <div
          className={className}
          data-test={`${dataTest}-heightTransition-container`}
          onTransitionEnd={(event) => {
            event.stopPropagation();

            if (event.propertyName == 'height') {
              // Transitioning stops
              isTransitioningRef.current = false;

              if (memoizeChildren && !children && prevChildren) {
                setRenderChildren(children);
              }

              if (onTransitionEnd) {
                onTransitionEnd(event);
              }

              // This will trigger force update so
              // `isTransitioningRef.current` will be applied
              observerCallback();
            }
          }}
          ref={ref as MutableRefObject<HTMLDivElement>}
          style={{
            height,
            overflow: isTransitioningRef.current ? 'hidden' : noOverflowAuto ? 'initial' : 'auto',
            transition: `height ${
              typeof transitionDuration !== 'undefined' ? `${transitionDuration}ms` : '300ms'
            } ${typeof transitionType !== 'undefined' ? transitionType : 'ease-in-out'}`,
            ...style
          }}
        >
          <div
            data-test={`${dataTest}-heightTransition-content`}
            className={contentClassName}
            ref={contentRef}
            style={noOverflowAuto ? undefined : { overflow: 'auto' }}
          >
            {memoizeChildren ? renderChildren : children}
          </div>
        </div>
      );
    }
  )
);

HeightTransitionBox.displayName = 'HeightTransitionBox';
