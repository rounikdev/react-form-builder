import { memo, useCallback, useRef, useState } from 'react';

import {
  useClass,
  useMount,
  useUnmount,
  useUpdate,
  useUpdateOnly
} from '@rounik/react-custom-hooks';

import { GlobalModel } from '@services';
import { RAFIdInfo } from '../../services';

import { CarouselProps, CarouselState } from './types';
import { defaultExtractId, defaultRenderFrame, getNextIndex } from './helpers';

import styles from './Carousel.scss';

const defaultHandler = () => {};

export const BaseCarousel = <T,>({
  auto = false,
  className,
  extractId = defaultExtractId,
  items = [],
  interval = 1000,
  keepDirection = true,
  pausable = false,
  renderFrame = defaultRenderFrame,
  renderLeftButton = defaultRenderFrame,
  renderMenu = defaultRenderFrame,
  renderRightButton = defaultRenderFrame,
  startIndex = 0,
  toLeft = false
}: CarouselProps<T>) => {
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
    [items]
  );

  const startAutoMove = useCallback(
    (timeout?: number) => {
      if (auto) {
        if (timeoutId.current) {
          GlobalModel.clearRAFTimeout(timeoutId.current);
        }

        timeoutId.current = GlobalModel.setRAFTimeout(
          () => move(),
          typeof timeout !== 'undefined' ? timeout : interval
        );
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
  }, [startAutoMove]);

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
  }, [items, keepDirection, moveLeft, moveRight, startAutoMove, toLeft]);

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
  }, [items, startIndex]);

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

  return (
    <div
      className={useClass([styles.Container, className], [className])}
      onBlur={pausable ? onMouseOutHandler : defaultHandler}
      onFocus={pausable ? onMouseOverHandler : defaultHandler}
      onMouseOver={pausable ? onMouseOverHandler : defaultHandler}
      onMouseOut={pausable ? onMouseOutHandler : defaultHandler}
      tabIndex={0}
    >
      {renderLeftButton({
        onClick: moveLeft
      })}
      {renderRightButton({
        onClick: moveRight
      })}
      {renderMenu({ current: state.current, items, move })}
      <div
        className={useClass([styles.Track, state.trackStyle], [state.trackStyle])}
        onTransitionEnd={onTransitionEndHandler}
      >
        {state.toLeft ? (
          <>
            <div className={styles.Frame} key={extractId(state.current)}>
              {renderFrame(state.current)}
            </div>
            <div className={styles.Frame} key={extractId(state.next)}>
              {renderFrame(state.next)}
            </div>
          </>
        ) : (
          <>
            <div className={styles.Frame} key={extractId(state.next)}>
              {renderFrame(state.next)}
            </div>
            <div className={styles.Frame} key={extractId(state.current)}>
              {renderFrame(state.current)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

type CarouselType = typeof BaseCarousel & { displayName: string };

export const Carousel = memo(BaseCarousel) as CarouselType;

Carousel.displayName = 'Carousel';
