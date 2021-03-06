import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FC, StrictMode, useCallback, useState } from 'react';

import { Button, Image } from '@ui';

import { Carousel } from '../Carousel';
import { images, images2, Picture } from './data';

import styles from './Carousel.stories.scss';

export default {
  component: Carousel,
  title: 'Components/Carousel'
} as ComponentMeta<typeof Carousel>;

const renderFrame = ({ dataTest, item }: { dataTest: string; item: Picture | null }) => {
  return !!item ? <Image dataTest={dataTest} {...item} /> : null;
};

const Carousels: FC = () => {
  const [auto, setAuto] = useState(false);

  const [toLeft, setToLeft] = useState(true);

  const [pausable, setPausable] = useState(true);

  const [imagesData, setImagesData] = useState(images);

  const toggleAuto = useCallback(() => {
    setAuto((current) => !current);
  }, []);

  const changeDirection = useCallback(() => {
    setToLeft((currentToLeft) => !currentToLeft);
  }, []);

  const toggleImages = useCallback(() => {
    setImagesData((current) => (current === images ? images2 : images));
  }, []);

  const togglePausable = useCallback(() => {
    setPausable((current) => !current);
  }, []);

  return (
    <div>
      <Button
        className={styles.Button}
        dataTest="change-auto"
        onClick={toggleAuto}
        text={auto ? 'Auto' : 'Manual'}
      />
      <Button
        className={styles.Button}
        dataTest="change-direction"
        onClick={changeDirection}
        text={toLeft ? 'To Left' : 'To Right'}
      />
      <Button
        className={styles.Button}
        dataTest="change-pausable"
        onClick={togglePausable}
        text={pausable ? 'Pausable' : 'Not Pausable'}
      />
      <Button
        className={styles.Button}
        dataTest="change-images"
        onClick={toggleImages}
        text={imagesData === images ? 'images' : 'images2'}
      />
      <Carousel
        auto={auto}
        className={styles.Carousel}
        dataTest="animals"
        extractLabel={(item) => item?.alt ?? ''}
        items={imagesData}
        interval={2000}
        keepDirection
        label="animals"
        pausable={pausable}
        renderFrame={renderFrame}
        startIndex={1}
        toLeft={toLeft}
      />
    </div>
  );
};

const Template: ComponentStory<FC> = () => (
  <StrictMode>
    <Carousels />
  </StrictMode>
);

export const CarouselDemo = Template.bind({});

CarouselDemo.args = {};
