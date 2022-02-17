import { FC, memo, useEffect, useMemo, useRef } from 'react';

import { GlobalModel, RAFIdInfo } from '@services';

import { HeightTransitionBoxAuto, HeightTransitionProvider } from '../../../HeightTransitionBox';

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
    scrollTimeout
  }) => {
    const { formData } = useFormRoot();

    const ref = useRef<null | HTMLDivElement>(null);
    const enableScrollRef = useRef(false);

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
      const enableScrollRafIdInfo = GlobalModel.setRAFTimeout(
        () => (enableScrollRef.current = true),
        ENABLE_SCROLL_SCROLL_RAF_TIMEOUT
      );

      return () => GlobalModel.clearRAFTimeout(enableScrollRafIdInfo);
    }, []);

    useEffect(() => {
      if (!enableScrollRef.current || noScroll) {
        return;
      }

      let rafIdInfo: RAFIdInfo;

      if (shouldRenderChildren) {
        rafIdInfo = GlobalModel.setRAFTimeout(() => {
          ref.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }, scrollTimeout ?? SCROLL_RAF_TIMEOUT);
      }

      return () => {
        GlobalModel.clearRAFTimeout(rafIdInfo);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRenderChildren]);

    return animate ? (
      <HeightTransitionProvider>
        <HeightTransitionBoxAuto
          className={className}
          contentClassName={contentClassName}
          dataTest={animateDataTest}
          memoizeChildren={animateMemoizeChildren}
          transitionDuration={animateDuration}
        >
          {childrenToRender}
        </HeightTransitionBoxAuto>
      </HeightTransitionProvider>
    ) : (
      childrenToRender
    );
  }
);

ConditionalFields.displayName = 'ConditionalFields';
