import { Children, cloneElement, FC, memo, useCallback, useRef, useState } from 'react';

import { useMountSafe, useUpdateOnlyExtended } from '@rounik/react-custom-hooks';

import { ListAnimatorChild, ListAnimatorProps, ListAnimatorState } from './types';

// https://stackoverflow.com/questions/47028558/
// react-cloneelement-inside-react-children-map-is-causing-element-keys-to-change/47030407#47030407
export const ListAnimator: FC<ListAnimatorProps> = memo(
  ({ children, className, enterClass, exitClass, tag: Tag = 'div' }) => {
    const [state, setState] = useState<ListAnimatorState>({
      content: null
    });

    const isAnimating = useRef(false);

    const addClass = useCallback(
      (child: ListAnimatorChild | null | undefined, classToAdd?: string) => {
        if (!classToAdd) {
          return child?.props?.className;
        } else if (child?.props?.className) {
          return `${child?.props?.className} ${classToAdd}`;
        } else {
          return classToAdd;
        }
      },
      []
    );

    const removeClass = useCallback(
      (child: ListAnimatorChild | null | undefined, classToRemove?: string) => {
        if (!classToRemove || !child?.props?.className) {
          return child?.props?.className;
        } else {
          return (
            child?.props.className
              ?.split(' ')
              .filter((currentClassName: string) => currentClassName !== classToRemove)
              .join(' ') ?? ''
          );
        }
      },
      []
    );

    const buildKeyMap = useCallback((elements: ListAnimatorChild[] | null | undefined) => {
      const keyMap: Record<string, boolean> = {};

      Children.forEach(elements, (child) => {
        if (child?.key) {
          keyMap[`${child?.key}`] = true;
        }
      });

      return keyMap;
    }, []);

    const cloneWithClassName = useCallback(
      (
        child: ListAnimatorChild | null | undefined,
        list: ListAnimatorChild[],
        updatedClassName: string
      ) => {
        if (!child) {
          return;
        }

        const cloned = cloneElement(
          child,
          {
            ...child.props,
            className: updatedClassName
          },
          child.props?.children
        );

        list.push(cloned);
      },
      []
    );

    const setNewChildren = useCallback(() => {
      if (isAnimating.current) {
        isAnimating.current = false;

        setState((prevState) => {
          const oldKeys = buildKeyMap(prevState.content);

          const newChildren: ListAnimatorChild[] = [];

          Children.forEach(children, (child) => {
            const isNewItem = !oldKeys[child?.key ?? ''];

            const updatedClassName = isNewItem
              ? addClass(child, enterClass)
              : removeClass(child, enterClass);

            cloneWithClassName(child, newChildren, updatedClassName);
          });

          return { content: newChildren };
        });
      }
    }, [addClass, buildKeyMap, children, cloneWithClassName, enterClass, removeClass]);

    useMountSafe(() => {
      const animatedChildren: ListAnimatorChild[] = [];

      Children.forEach(children, (child) => {
        cloneWithClassName(child, animatedChildren, addClass(child, enterClass));
      });

      setState({
        content: animatedChildren
      });
    });

    useUpdateOnlyExtended(() => {
      let exitCount = 0;

      setState((prevState) => {
        const newKeys = buildKeyMap(children);

        if (!isAnimating.current) {
          isAnimating.current = true;

          const animatedChildren = [] as ListAnimatorChild[];

          Children.forEach(prevState.content, (child) => {
            let updatedClassName = addClass(child);

            const isExiting = !newKeys[`${child?.key}`];

            if (isExiting) {
              exitCount++;

              updatedClassName = addClass(child, exitClass);
            } else {
              updatedClassName = removeClass(child, enterClass);
            }

            cloneWithClassName(child, animatedChildren, updatedClassName);
          });

          return { content: animatedChildren };
        }

        return prevState;
      });

      // Because there will be no
      // animation/transition end,
      // we need to manually set
      // the new children:
      if (exitCount === 0) {
        setNewChildren();
      }
    }, [children]);

    return (
      <Tag className={className} onAnimationEnd={setNewChildren} onTransitionEnd={setNewChildren}>
        {state.content}
      </Tag>
    );
  }
);

ListAnimator.displayName = 'ListAnimator';
