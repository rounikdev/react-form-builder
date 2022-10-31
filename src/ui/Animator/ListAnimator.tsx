import {
  AnimationEvent,
  Children,
  FC,
  memo,
  TransitionEvent,
  useCallback,
  useRef,
  useState
} from 'react';

import { useUpdateOnly } from '@rounik/react-custom-hooks';

import { addClass, buildKeyMap, cloneWithClassName, getUpdates, removeClass } from './services';
import {
  ListAnimatorChild,
  ListAnimatorKeyMap,
  ListAnimatorProps,
  ListAnimatorState
} from './types';

// https://stackoverflow.com/questions/47028558/
// react-cloneelement-inside-react-children-map-is-causing-element-keys-to-change/47030407#47030407
export const ListAnimator: FC<ListAnimatorProps> = memo(
  ({ children, className, enterClass, exitClass, tag: Tag = 'div' }) => {
    const isExit = useRef(false);

    const journal = useRef<ListAnimatorKeyMap>({});

    const enterNewChildren = useCallback(
      (newItems: ListAnimatorChild[] | undefined, oldKeys: ListAnimatorKeyMap) => {
        const newChildren: ListAnimatorChild[] = [];

        Children.forEach(newItems, (child) => {
          const isNewItem = !oldKeys[child?.key ?? ''];

          const updatedClassName = isNewItem
            ? addClass(child, enterClass)
            : removeClass(child, enterClass);

          cloneWithClassName(child, newChildren, updatedClassName);
        });

        return newChildren;
      },
      [enterClass]
    );

    const exitOldChildren = useCallback(
      (newItems: ListAnimatorChild[] | null | undefined, newKeys: ListAnimatorKeyMap) => {
        const oldChildren: ListAnimatorChild[] = [];

        Children.forEach(newItems, (child) => {
          const isExiting = !newKeys[child?.key ?? ''];

          let updatedClassName = isExiting
            ? addClass(child, exitClass)
            : removeClass(child, enterClass);

          if (isExiting) {
            updatedClassName =
              (updatedClassName as string)
                ?.split(' ')
                .filter((c) => c !== enterClass)
                .join(' ') ?? '';
          }

          cloneWithClassName(child, oldChildren, updatedClassName);
        });

        return oldChildren;
      },
      [enterClass, exitClass]
    );

    const [state, setState] = useState<ListAnimatorState>({
      content: enterNewChildren(children, {})
    });

    const animationEndHandler = useCallback(
      (event: AnimationEvent | TransitionEvent) => {
        if (!isExit.current) {
          return;
        }

        if (event.target) {
          const target = event.target as Element;
          const classList = Array.from(target.classList);

          if (!classList.find((c) => c === exitClass)) {
            return;
          }
        }

        isExit.current = false;

        setState((prevState) => ({
          content: enterNewChildren(children, buildKeyMap(prevState.content))
        }));
      },
      [children, enterNewChildren, exitClass]
    );

    useUpdateOnly(() => {
      setState((prevState) => {
        const { enterCount, exitCount, newKeys, oldKeys } = getUpdates(children, prevState.content);

        if (!enterCount && !exitCount) {
          return { content: enterNewChildren(children, journal.current) };
        }

        journal.current = isExit.current ? newKeys : oldKeys;

        // Perform exiting before entering the
        // new items. If also new items are coming,
        // they will be set after the exit animation
        // has ended:
        if (exitCount) {
          isExit.current = true;

          return { content: exitOldChildren(prevState.content, newKeys) };
        }

        if (enterCount) {
          isExit.current = false;

          return { content: enterNewChildren(children, oldKeys) };
        }

        return { content: enterNewChildren(children, journal.current) };
      });
    }, [children]);

    return (
      <Tag
        className={className}
        onAnimationEnd={animationEndHandler}
        onTransitionEnd={animationEndHandler}
      >
        {state.content}
      </Tag>
    );
  }
);

ListAnimator.displayName = 'ListAnimator';
