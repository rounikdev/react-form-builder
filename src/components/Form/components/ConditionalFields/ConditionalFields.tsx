import { FC, memo, useEffect, useMemo, useRef, useState } from 'react';

import { GlobalModel } from '@services';

import { HeightTransitionBox, HeightTransitionProvider } from '../../../HeightTransitionBox';

import { useFormRoot } from '../../providers';
import { ConditionalFieldsProps } from '../../types';

const ENABLE_SCROLL_SCROLL_RAF_TIMEOUT = 600; // ms
const SCROLL_RAF_TIMEOUT = 300; // ms

export const ConditionalFields: FC<ConditionalFieldsProps> = memo(
  ({
    animate,
    animateDataTest,
    animateDuration,
    animateMemoizeChildren,
    children,
    className,
    condition,
    contentClassName,
    noScroll,
    scrollTimeout = SCROLL_RAF_TIMEOUT
  }) => {
    const { formData } = useFormRoot();

    const ref = useRef<null | HTMLDivElement>(null);
    const [enableScroll, setEnableScroll] = useState(false);

    const shouldRenderChildren = useMemo(() => condition(formData), [condition, formData]);

    const childrenToRender = useMemo(
      () =>
        shouldRenderChildren ? (
          <>
            <div
              ref={ref}
              style={{ width: 0, height: 0, overflow: 'hidden', visibility: 'hidden' }}
            />
            {children}
          </>
        ) : null,
      [children, shouldRenderChildren]
    );

    useEffect(() => {
      const enableScrollRafIdInfo = GlobalModel.setRAFTimeout(() => {
        setEnableScroll(true);
      }, ENABLE_SCROLL_SCROLL_RAF_TIMEOUT);

      return () => GlobalModel.clearRAFTimeout(enableScrollRafIdInfo);
    }, []);

    useEffect(() => {
      if (!shouldRenderChildren || !enableScroll || noScroll) {
        return;
      }

      const rafIdInfo = GlobalModel.setRAFTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }, scrollTimeout);

      return () => {
        GlobalModel.clearRAFTimeout(rafIdInfo);
      };
    }, [enableScroll, noScroll, scrollTimeout, shouldRenderChildren]);

    return animate ? (
      <HeightTransitionProvider>
        <HeightTransitionBox
          className={className}
          contentClassName={contentClassName}
          dataTest={animateDataTest}
          memoizeChildren={animateMemoizeChildren}
          transitionDuration={animateDuration}
        >
          {childrenToRender}
        </HeightTransitionBox>
      </HeightTransitionProvider>
    ) : (
      childrenToRender
    );
  }
);

ConditionalFields.displayName = 'ConditionalFields';
