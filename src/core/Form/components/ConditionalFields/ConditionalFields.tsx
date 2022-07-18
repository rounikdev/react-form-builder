import { CSSProperties, FC, memo, useEffect, useMemo, useRef, useState } from 'react';

import { useFormRoot } from '@core/Form/providers';
import { ConditionalFieldsProps } from '@core/Form/types';
import { HeightTransitionBox, HeightTransitionProvider } from '@core/HeightTransitionBox';
import { GlobalModel } from '@services';

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
    hidden,
    noScroll,
    scrollTimeout = SCROLL_RAF_TIMEOUT
  }) => {
    const { formData } = useFormRoot();

    const ref = useRef<null | HTMLDivElement>(null);
    const styleRef = useRef<CSSProperties>({});

    const [enableScroll, setEnableScroll] = useState(false);

    const shouldRenderChildren = useMemo(() => condition(formData), [condition, formData]);

    const childrenToRender = useMemo(() => {
      if (!shouldRenderChildren) {
        if (hidden) {
          styleRef.current = { display: 'none' };
        } else {
          return null;
        }
      } else {
        styleRef.current = {};
      }

      return children;
    }, [children, hidden, shouldRenderChildren]);

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
          ref={ref}
          style={styleRef.current}
          transitionDuration={animateDuration}
        >
          {childrenToRender}
        </HeightTransitionBox>
      </HeightTransitionProvider>
    ) : (
      <div className={className} ref={ref} style={styleRef.current}>
        <div className={contentClassName}>{childrenToRender}</div>
      </div>
    );
  }
);

ConditionalFields.displayName = 'ConditionalFields';
