import { FC, memo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { Button } from '../../../Button/Button';

import { CarouselButtonProps } from '../../types';

import styles from './CarouselButton.scss';

export const CarouselButton: FC<CarouselButtonProps> = memo(
  ({ dataTest, isLeft, label, onClick, text }) => {
    return (
      <Button
        className={useClass([styles.Container, isLeft ? styles.Left : styles.Right], [isLeft])}
        dataTest={`${dataTest}-carousel-${isLeft ? 'left' : 'right'}-button`}
        label={label}
        onClick={onClick}
        text={text}
      />
    );
  }
);

CarouselButton.displayName = 'CarouselButton';
