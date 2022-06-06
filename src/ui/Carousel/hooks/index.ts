import { useCallback, useRef, useState } from 'react';

import { useMount, useUnmount, useUpdate, useUpdateOnly } from '@rounik/react-custom-hooks';

import { GlobalModel } from '@services';
import { RAFIdInfo } from '../../../services';

import { getNextIndex } from '../helpers';
import { CarouselState, UseCarouselConfig } from '../types';

export const useCarousel = <T>({
  auto,
  interval,
  items,
  keepDirection,
  startIndex,
  styles,
  toLeft
}: UseCarouselConfig<T>) => {
  const [state, setState] = useState<CarouselState<T>>({
    current: items[startIndex <= items.length - 1 ? startIndex : 0] || null,
    currentIndex: startIndex <= items.length - 1 ? startIndex : 0,
    next: null,
    toLeft,
    trackStyle: toLeft ? '' : styles.ToRight
  });

  const transitioning = useRef<boolean>(false);

  const scheduledMove = useRef<'left' | 'right' | null>(null);

  const timeoutId = useRef<RAFIdInfo | null | undefined>(null);

  const move = useCallback(
    (index?: number) => {
      if (items.length === 1) {
        return;
      }

      transitioning.current = true;

      setState((currentState) => {
        let current = currentState.current;

        if (currentState.current === null) {
          current = currentState.next;
        }

        const nextIndex =
          typeof index !== 'undefined' && index !== currentState.currentIndex
            ? index
            : getNextIndex(currentState.currentIndex, items.length - 1, currentState.toLeft);

        let newCurrentIndex = currentState.currentIndex;

        if (typeof index !== 'undefined' && index !== newCurrentIndex) {
          newCurrentIndex = currentState.toLeft ? index - 1 : index + 1;
        }

        return {
          ...currentState,
          current,
          currentIndex: newCurrentIndex,
          next: items[nextIndex],
          trackStyle: currentState.toLeft ? styles.MoveToLeft : styles.MoveToRight
        };
      });
    },
    [items, styles.MoveToLeft, styles.MoveToRight]
  );

  const startAutoMove = useCallback(
    (timeout?: number) => {
      if (auto) {
        if (timeoutId.current) {
          GlobalModel.clearRAFTimeout(timeoutId.current);
        }

        timeoutId.current = GlobalModel.setRAFTimeout(() => move(), timeout ?? interval ?? 0);
      }
    },
    [auto, interval, move]
  );

  const moveLeft = useCallback(() => {
    if (!transitioning.current) {
      setState((currentState) => ({
        ...currentState,
        toLeft: true,
        trackStyle: ''
      }));

      startAutoMove(50);
    } else {
      scheduledMove.current = 'left';
    }
  }, [startAutoMove]);

  const moveRight = useCallback(() => {
    if (!transitioning.current) {
      setState((currentState) => ({
        ...currentState,
        toLeft: false,
        trackStyle: styles.ToRight
      }));

      startAutoMove(50);
    } else {
      scheduledMove.current = 'right';
    }
  }, [startAutoMove, styles.ToRight]);

  const onTransitionEndHandler = useCallback(() => {
    setState((currentState) => {
      transitioning.current = false;

      const nextIndex = getNextIndex(
        currentState.currentIndex,
        items.length - 1,
        currentState.toLeft
      );

      return {
        ...currentState,
        currentIndex: nextIndex,
        current: currentState.next,
        next: items[getNextIndex(nextIndex, items.length - 1, currentState.toLeft)],
        trackStyle: currentState.toLeft ? '' : styles.ToRight
      };
    });

    if (scheduledMove.current) {
      if (scheduledMove.current === 'left') {
        moveLeft();
      } else {
        moveRight();
      }

      scheduledMove.current = null;
    } else {
      if (toLeft && keepDirection) {
        setState((currentState) => ({
          ...currentState,
          toLeft: true,
          trackStyle: ''
        }));
      } else if (keepDirection) {
        setState((currentState) => ({
          ...currentState,
          toLeft: false,
          trackStyle: styles.ToRight
        }));
      }

      startAutoMove();
    }
  }, [items, keepDirection, moveLeft, moveRight, startAutoMove, styles.ToRight, toLeft]);

  const onMouseOverHandler = useCallback(() => {
    if (timeoutId.current) {
      GlobalModel.clearRAFTimeout(timeoutId.current);
    }
  }, []);

  const onMouseOutHandler = useCallback(() => {
    startAutoMove();
  }, [startAutoMove]);

  const handleNewItems = useCallback(() => {
    setState((currentState) => {
      return {
        ...currentState,
        current: items[startIndex] || null,
        currentIndex: startIndex,
        next: items[getNextIndex(startIndex, items.length - 1, currentState.toLeft)],
        trackStyle: currentState.toLeft ? styles.MoveToLeft : styles.MoveToRight
      };
    });
  }, [items, startIndex, styles.MoveToLeft, styles.MoveToRight]);

  useMount(() => {
    startAutoMove();
  });

  useUpdateOnly(handleNewItems, [handleNewItems]);

  useUpdate(() => {
    setState((currentState) => ({
      ...currentState,
      toLeft,
      trackStyle: toLeft ? '' : styles.ToRight
    }));

    startAutoMove();
  }, [startAutoMove, toLeft]);

  useUnmount(() => {
    if (timeoutId.current) {
      GlobalModel.clearRAFTimeout(timeoutId.current);
    }
  });

  return {
    move,
    moveLeft,
    moveRight,
    onMouseOutHandler,
    onMouseOverHandler,
    onTransitionEndHandler,
    state
  };
};
