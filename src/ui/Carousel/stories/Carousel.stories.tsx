import { FC, StrictMode, useCallback, useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { useClass } from '@rounik/react-custom-hooks';

import { GlobalModel } from '@services';

import { Button } from '../../Button/Button';
import { IconChevronLeft, IconChevronRight } from '../../icons';
import { Image } from '../../Image/Image';

import { Carousel } from '../Carousel';

import { images, images2 } from './data';

import styles from './Carousel.stories.scss';

export default {
  title: 'Components/Carousel',
  component: Carousel
} as ComponentMeta<typeof Carousel>;

interface Picture {
  alt: string;
  id: number;
  src: string;
}

const Carousels: FC = () => {
  const [toLeft, setToLeft] = useState(true);
  const [pausable, setPausable] = useState(true);
  const [imagesData, setImagesData] = useState(images);

  const changeDirection = useCallback(() => {
    setToLeft((currentToLeft) => !currentToLeft);
  }, []);

  const toggleImages = useCallback(() => {
    setImagesData((current) => (current === images ? images2 : images));
  }, []);

  const togglePausable = useCallback(() => {
    setPausable((current) => !current);
  }, []);

  const renderFrame = useCallback((item) => {
    return !!item ? <Image {...item} /> : null;
  }, []);

  const renderLeftButton = useCallback((props) => {
    return (
      <Button
        className={styles.LeftButton}
        {...props}
        label="moveLeft"
        text={<IconChevronLeft action />}
      />
    );
  }, []);

  const renderRightButton = useCallback((props) => {
    return (
      <Button
        className={styles.RightButton}
        {...props}
        label="moveRight"
        text={<IconChevronRight action />}
      />
    );
  }, []);

  const renderMenu = useCallback(
    ({
      current,
      items,
      move
    }: {
      current: Picture | null;
      items: Picture[];
      move: (index?: number) => void;
    }) => {
      return (
        <div className={styles.Menu}>
          {items.map((item, index) => {
            const isCurrentItem = current?.id === item.id;
            return (
              <Button
                className={GlobalModel.classer([
                  styles.MenuButton,
                  isCurrentItem && styles.Current
                ])}
                label={item.alt}
                dataTest={`menu-button-item-${index}`}
                disabled={isCurrentItem}
                key={item.id}
                onClick={() => {
                  move(index);
                }}
                text=""
              />
            );
          })}
        </div>
      );
    },
    []
  );

  return (
    <article>
      <Button
        className={styles.Button}
        dataTest="direction"
        onClick={changeDirection}
        text={toLeft ? 'To Left' : 'To Right'}
      />
      <Button
        className={styles.Button}
        dataTest="pausable"
        onClick={togglePausable}
        text={pausable ? 'Pausable' : 'Not Pausable'}
      />
      <Button
        className={styles.Button}
        dataTest="images"
        onClick={toggleImages}
        text={imagesData === images ? 'images' : 'images2'}
      />
      <Carousel
        auto
        className={useClass([styles.Carousel, pausable && styles.Pausable], [pausable])}
        items={imagesData}
        interval={2000}
        keepDirection
        pausable={pausable}
        renderFrame={renderFrame}
        renderLeftButton={renderLeftButton}
        renderMenu={renderMenu}
        renderRightButton={renderRightButton}
        startIndex={1}
        toLeft={toLeft}
      />
    </article>
  );
};

const Template: ComponentStory<FC> = () => (
  <StrictMode>
    <Carousels />
  </StrictMode>
);

export const CarouselDemo = Template.bind({});

CarouselDemo.args = {};
