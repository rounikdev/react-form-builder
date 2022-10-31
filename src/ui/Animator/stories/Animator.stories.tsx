import { Story } from '@storybook/react';
import { FC, memo, StrictMode, useCallback, useState } from 'react';

import { useClass, useMount } from '@rounik/react-custom-hooks';

import { ListAnimator } from '../ListAnimator';

import styles from './Animator.stories.scss';

export default {
  title: 'Components/Animator'
};

interface ListItem {
  className?: string;
  id: number;
}

const Item: FC<ListItem> = memo(({ className, id }) => {
  useMount(() => {
    console.log('mounting', id);
  });
  return (
    <div className={useClass([styles.Item, className], [className])}>
      {id}
      <div className={styles.Nested}>hi</div>
    </div>
  );
});

Item.displayName = 'Item';

const Animators: FC = () => {
  const [list, setList] = useState<ListItem[]>([{ id: new Date().getTime() }]);

  const updateList = useCallback((index?: number) => {
    setList((currentList) => {
      const newList = [...currentList];
      if (currentList.length > 3) {
        if (index) {
          newList.splice(index, 1);
        } else {
          newList.shift();
        }
      }

      newList.push({ id: new Date().getTime() });

      return newList;
    });
  }, []);

  return (
    <div className={styles.Container}>
      <button onClick={() => updateList()}>Update</button>
      <button onClick={() => updateList(1)}>Update 1</button>
      <ListAnimator enterClass={styles.Enter} exitClass={styles.Exit}>
        {list.map((item) => {
          return <Item id={item.id} key={item.id} />;
        })}
      </ListAnimator>
      <ListAnimator enterClass={styles.Enter} exitClass={styles.Exit}>
        {list.map((item) => {
          return <div key={item.id}>{item.id}</div>;
        })}
      </ListAnimator>
    </div>
  );
};

const Template: Story<FC> = () => (
  <StrictMode>
    <Animators />
  </StrictMode>
);

export const AnimatorsDemo = Template.bind({});

AnimatorsDemo.args = {};
