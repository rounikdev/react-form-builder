import { memo } from 'react';

import { GlobalModel } from '@services';

import { Button } from '../../../Button/Button';

import { CarouselMenuProps } from '../../types';

import styles from './CarouselMenu.scss';

const CarouselMenuBasic = <T,>({
  current,
  dataTest,
  extractId,
  extractLabel,
  items,
  move
}: CarouselMenuProps<T>) => {
  return (
    <div className={styles.Container}>
      {items.map((item, index) => {
        const isCurrentItem = extractId(current) === extractId(item);
        return (
          <Button
            className={GlobalModel.classer([styles.Button, isCurrentItem && styles.Current])}
            label={extractLabel(item)}
            dataTest={`${dataTest}-carousel-menu-button-item-${index}`}
            disabled={isCurrentItem}
            key={extractId(item)}
            onClick={() => {
              move(index);
            }}
            text=""
          />
        );
      })}
    </div>
  );
};

type CarouselMenuType = typeof CarouselMenuBasic & { displayName: string };

export const CarouselMenu = memo(CarouselMenuBasic) as CarouselMenuType;

CarouselMenu.displayName = 'CarouselMenu';
