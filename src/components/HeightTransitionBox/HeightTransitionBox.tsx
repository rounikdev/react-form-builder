import { FC, memo, useCallback, useRef, useState } from 'react';
import {
  useLastDiffValue,
  useMutationObserver,
  usePrevious,
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

export const HeightTransitionBox: FC<HeightTransitionBoxProps> = memo(
  ({
    children,
    className,
    contentClassName,
    dataTest,
    isRoot,
    memoizeChildren,
    onTransitionEnd,
    transitionDuration,
    transitionType
  }) => {
    const {
      actions: { forceUpdate },
      shouldForceUpdate
    } = useHeightTransition();

    const contentRef = useRef<HTMLDivElement>(null);

    const [, setRender] = useState({});
    const [renderChildren, setRenderChildren] = useState(children);

    const prevChildren = useLastDiffValue(children);

    const observerCallback = useCallback(() => {
      setRender({});
      !isRoot && forceUpdate();
    }, [forceUpdate, isRoot]);

    useMutationObserver({
      callback: observerCallback,
      config: MUTATION_OBSERVER_CONFIG,
      target: contentRef
    });

    useWindowResize({ callback: observerCallback, debounceTime: DEBOUNCE_TIME });

    // Handles nested transitions like
    // ErrorFields of ConditionalFields
    useUpdateOnly(() => {
      isRoot && observerCallback();
    }, [isRoot, observerCallback, shouldForceUpdate]);

    useUpdateOnly(() => {
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
    const prevHeight = usePrevious(contentRef.current?.offsetHeight);

    // Create `heightDiffRef` to detect the first `height` difference
    const heightDiffRef = useRef<number | undefined>(height);

    // Set `height` to 0
    if (memoizeChildren && prevHeight !== undefined && !children && prevChildren) {
      height = 0;
    }

    // If there is a diff then transitioning occurs
    if (height !== heightDiffRef.current) {
      isTransitioningRef.current = true;
      heightDiffRef.current = height;
    }

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
        style={{
          height,
          overflow: isTransitioningRef.current ? 'hidden' : 'auto',
          transition: `height ${
            typeof transitionDuration !== 'undefined' ? `${transitionDuration}ms` : '300ms'
          } ${typeof transitionType !== 'undefined' ? transitionType : 'ease-in-out'}`
        }}
      >
        <div
          data-test={`${dataTest}-heightTransition-content`}
          className={contentClassName}
          ref={contentRef}
          style={{ overflow: 'auto' }}
        >
          {memoizeChildren ? renderChildren : children}
        </div>
      </div>
    );
  }
);

HeightTransitionBox.displayName = 'HeightTransitionBox';
