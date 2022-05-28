import { FC, memo, useCallback, useState } from 'react';

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

    useMount(() => {
      setState({
        content: children,
        exiting: false
      });
    });

    useUpdateOnly(() => {
      setState((prevState) =>
        shouldAnimate(prevState.content, children)
          ? { ...prevState, exiting: true }
          : { content: children, exiting: false }
      );
    }, [children]);

    const setNewChildren = useCallback(() => {
      setState({
        content: children,
        exiting: false
      });
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
