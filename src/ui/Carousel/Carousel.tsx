import { memo, MouseEventHandler } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { IconChevronLeft, IconChevronRight } from '../icons';
import { CarouselButton, CarouselMenu } from './components';
import { defaultExtractId, defaultExtractLabel, defaultRenderFrame } from './helpers';
import { useCarousel } from './hooks';
import { CarouselMenuProps, CarouselProps } from './types';

import styles from './Carousel.scss';

const defaultHandler = () => {};

const defaultRenderLeftButton = ({
  dataTest,
  onClick
}: {
  dataTest: string;
  onClick: MouseEventHandler;
}) => {
  return (
    <CarouselButton
      dataTest={dataTest}
      isLeft
      onClick={onClick}
      label="moveLeft"
      text={<IconChevronLeft action light />}
    />
  );
};

const defaultRenderRightButton = ({
  dataTest,
  onClick
}: {
  dataTest: string;
  onClick: MouseEventHandler;
}) => {
  return (
    <CarouselButton
      dataTest={dataTest}
      onClick={onClick}
      label="moveRight"
      text={<IconChevronRight action light />}
    />
  );
};

const defaultRenderMenu = <T,>(params: CarouselMenuProps<T>) => {
  return <CarouselMenu {...params} />;
};

export const BaseCarousel = <T,>({
  auto,
  className,
  dataTest,
  extractId = defaultExtractId,
  extractLabel = defaultExtractLabel,
  items = [],
  interval = 1000,
  keepDirection = true,
  label,
  pausable,
  renderFrame = defaultRenderFrame,
  renderLeftButton = defaultRenderLeftButton,
  renderMenu = defaultRenderMenu,
  renderRightButton = defaultRenderRightButton,
  startIndex = 0,
  toLeft
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
      className={useClass(
        [styles.Container, pausable && styles.Pausable, className],
        [className, pausable]
      )}
      data-test={`${dataTest}-carousel`}
      onBlur={pausable ? onMouseOutHandler : defaultHandler}
      onFocus={pausable ? onMouseOverHandler : defaultHandler}
      onMouseOver={pausable ? onMouseOverHandler : defaultHandler}
      onMouseOut={pausable ? onMouseOutHandler : defaultHandler}
      role="region"
      tabIndex={0}
    >
      <h2 aria-label={extractLabel(state.current)} aria-live="polite" className={styles.Current}>
        {extractLabel(state.current)}
      </h2>
      {renderLeftButton({
        dataTest,
        onClick: moveLeft
      })}
      {renderRightButton({
        dataTest,
        onClick: moveRight
      })}
      {renderMenu({ current: state.current, dataTest, extractId, extractLabel, items, move })}
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
              {renderFrame({ dataTest: extractId(state.current), item: state.current })}
            </div>
            <div
              className={styles.Frame}
              data-test={`${dataTest}-carousel-frame-next`}
              key={extractId(state.next)}
            >
              {renderFrame({ dataTest: extractId(state.next), item: state.next })}
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.Frame}
              data-test={`${dataTest}-carousel-frame-current`}
              key={extractId(state.next)}
            >
              {renderFrame({ dataTest: extractId(state.next), item: state.next })}
            </div>
            <div
              className={styles.Frame}
              data-test={`${dataTest}-carousel-frame-next`}
              key={extractId(state.current)}
            >
              {renderFrame({ dataTest: extractId(state.current), item: state.current })}
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
