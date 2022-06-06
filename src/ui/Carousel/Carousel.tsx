import { memo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useCarousel } from './hooks';
import { CarouselProps } from './types';
import { defaultExtractId, defaultRenderFrame } from './helpers';

import styles from './Carousel.scss';

const defaultHandler = () => {};

export const BaseCarousel = <T,>({
  auto = false,
  className,
  dataTest,
  extractId = defaultExtractId,
  items = [],
  interval = 1000,
  keepDirection = true,
  label,
  pausable = false,
  renderFrame = defaultRenderFrame,
  renderLeftButton = defaultRenderFrame,
  renderMenu = defaultRenderFrame,
  renderRightButton = defaultRenderFrame,
  startIndex = 0,
  toLeft = false
}: CarouselProps<T>) => {
  const {
    move,
    moveLeft,
    moveRight,
    onMouseOutHandler,
    onMouseOverHandler,
    onTransitionEndHandler,
    state
  } = useCarousel({
    auto,
    interval,
    items,
    keepDirection,
    startIndex,
    styles: {
      MoveToLeft: styles.MoveToLeft,
      MoveToRight: styles.MoveToRight,
      ToRight: styles.ToRight
    },
    toLeft
  });

  return (
    <div
      aria-label={label}
      className={useClass([styles.Container, className], [className])}
      data-test={`${dataTest}-carousel`}
      onBlur={pausable ? onMouseOutHandler : defaultHandler}
      onFocus={pausable ? onMouseOverHandler : defaultHandler}
      onMouseOver={pausable ? onMouseOverHandler : defaultHandler}
      onMouseOut={pausable ? onMouseOutHandler : defaultHandler}
      tabIndex={0}
    >
      {renderLeftButton({
        dataTest,
        onClick: moveLeft
      })}
      {renderRightButton({
        dataTest,
        onClick: moveRight
      })}
      {renderMenu({ current: state.current, dataTest, items, move })}
      <div
        className={useClass([styles.Track, state.trackStyle], [state.trackStyle])}
        data-test={`${dataTest}-carousel-track`}
        onTransitionEnd={onTransitionEndHandler}
      >
        {state.toLeft ? (
          <>
            <div
              className={styles.Frame}
              data-test={`${dataTest}-carousel-frame-current`}
              key={extractId(state.current)}
            >
              {renderFrame(state.current)}
            </div>
            <div
              className={styles.Frame}
              data-test={`${dataTest}-carousel-frame-next`}
              key={extractId(state.next)}
            >
              {renderFrame(state.next)}
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.Frame}
              data-test={`${dataTest}-carousel-frame-current`}
              key={extractId(state.next)}
            >
              {renderFrame(state.next)}
            </div>
            <div
              className={styles.Frame}
              data-test={`${dataTest}-carousel-frame-next`}
              key={extractId(state.current)}
            >
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
