import { FC, memo, ReactNode, useState } from 'react';

import { usePrevious, useUpdateOnly } from '@rounik/react-custom-hooks';

import { DatepickerChanged } from '../../types';

interface AnimateProps {
  changed: DatepickerChanged;
  children: ReactNode;
  timeout: number;
  toLeft: boolean;
  width: number;
}

export const Animate: FC<AnimateProps> = memo(({ changed, children, timeout, toLeft, width }) => {
  const prevChildren = usePrevious(children);

  const [state, setState] = useState({
    a: children,
    b: prevChildren,
    styles: {} as { transform?: string; transition?: string }
  });

  useUpdateOnly(() => {
    if (changed.init) {
      return;
    }

    setState({
      a: toLeft ? children : prevChildren,
      b: toLeft ? prevChildren : children,
      styles: {
        transform: `translateX(${toLeft ? -width : 0}px)`,
        transition: 'all 1ms ease-in-out'
      }
    });
    console.log('>');
    // requestAnimationFrame(() => {
    //   setState({
    //     a: toLeft ? children : prevChildren,
    //     b: toLeft ? prevChildren : children,
    //     styles: {
    //       transform: `translateX(${toLeft ? 0 : -width}px)`,
    //       transition: `transform ${timeout}ms ease-in-out`
    //     }
    //   });
    // });
  }, [changed, timeout, toLeft, width]);

  return (
    <div
      onTransitionEnd={() => {
        console.log(toLeft);
        if (state.styles.transition === 'all 1ms ease-in-out') {
          setState({
            a: toLeft ? children : prevChildren,
            b: toLeft ? prevChildren : children,
            styles: {
              transform: `translateX(${toLeft ? 0 : -width}px)`,
              transition: `transform ${timeout}ms ease-in-out`
            }
          });
        }
      }}
      style={{
        display: 'flex',
        height: '100%',
        width: `${2 * width}px`,
        willChange: 'transform',
        ...state.styles
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width,
          height: '100%'
        }}
      >
        {state.a}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width,
          height: '100%'
        }}
      >
        {state.b}
      </div>
    </div>
  );
});

Animate.displayName = 'Animate';
