import { FC, memo, useCallback, useRef, useState } from 'react';

import { useClass, useMount, useUpdateOnly } from '@rounik/react-custom-hooks';

import { AnimatorProps, AnimatorState } from './types';

// Defaults to always animate
// on children update:
const defaultShouldAnimate = () => true;

export const Animator: FC<AnimatorProps> = memo(
  ({
    children,
    className,
    enterClass,
    exitClass,
    shouldAnimate = defaultShouldAnimate,
    tag: Tag = 'div'
  }) => {
    const [state, setState] = useState<AnimatorState>({
      content: null,
      exiting: false
    });

    const isAnimating = useRef(false);

    useMount(() => {
      setState({
        content: children,
        exiting: false
      });
    });

    useUpdateOnly(() => {
      setState((prevState) => {
        if (shouldAnimate(prevState.content, children) && !isAnimating.current) {
          isAnimating.current = true;

          return { ...prevState, exiting: true };
        }

        return prevState;
      });
    }, [children]);

    const setNewChildren = useCallback(() => {
      if (isAnimating.current) {
        isAnimating.current = false;

        setState({
          content: children,
          exiting: false
        });
      }
    }, [children]);

    return (
      <Tag
        className={useClass(
          [state.exiting ? exitClass : enterClass, className],
          [state.exiting, exitClass, enterClass, className]
        )}
        onAnimationEnd={setNewChildren}
        onTransitionEnd={setNewChildren}
      >
        {state.content}
      </Tag>
    );
  }
);

Animator.displayName = 'Animator';
