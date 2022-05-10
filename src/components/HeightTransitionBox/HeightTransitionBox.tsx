import { FC, memo, useCallback, useRef, useState } from 'react';
import { useMutationObserver } from '@rounik/react-custom-hooks';

import { useHeightTransition } from './HeightTransitionProvider';
import { HeightTransitionBoxProps } from './types';

const MUTATION_OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
};

export const HeightTransitionBox: FC<HeightTransitionBoxProps> = memo(
  ({ children, className, onTransitionEnd, transitionDuration, transitionType }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const {
      actions: { forceUpdate }
    } = useHeightTransition();

    const [, setRender] = useState({});

    const observerCallback = useCallback(() => {
      forceUpdate();
      setRender({});
    }, [forceUpdate]);

    useMutationObserver({
      callback: observerCallback,
      config: MUTATION_OBSERVER_CONFIG,
      target: contentRef
    });

    return (
      <div
        className={className}
        onTransitionEnd={(event) => {
          event.stopPropagation();

          if (event.propertyName == 'height') {
            if (onTransitionEnd) {
              onTransitionEnd(event);
            }

            observerCallback();
          }
        }}
        style={{
          height: contentRef.current?.offsetHeight,
          overflow: 'hidden',
          transition: `height ${
            typeof transitionDuration !== 'undefined' ? `${transitionDuration}ms` : '300ms'
          } ${typeof transitionType !== 'undefined' ? transitionType : 'ease-in-out'}`
        }}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    );
  }
);

HeightTransitionBox.displayName = 'HeightTransitionBox';
