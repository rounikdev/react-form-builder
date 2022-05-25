import { createRef, memo, RefObject, useMemo, useState } from 'react';
import Scroll from 'react-scroll-component';

import { usePrevious, useUpdate, useUpdateOnly } from '@rounik/react-custom-hooks';

import { ListProps } from '../../types';

import styles from './List.scss';

export const List = <T,>({
  dataTest,
  id,
  list,
  multi,
  renderOption,
  rowsToDisplay = 4
}: ListProps<T>) => {
  const [style, setStyle] = useState({ height: 0, maxHeight: 0 });
  const [listToRender, setListToRender] = useState(list);

  const [rowRefs, setRowRefs] = useState<RefObject<HTMLLIElement>[]>([]);

  const prevList = usePrevious(list);

  const scrollerOptions = useMemo(() => {
    return {
      className: styles.ScrollerContainer,
      direction: 'vertical',
      height: style.maxHeight,
      scrollerClass: styles.Scroller
    };
  }, [style.maxHeight]);

  const options = useMemo(() => {
    return listToRender.map((item, index) => {
      return rowRefs[index] ? renderOption({ item, ref: rowRefs[index] }) : null;
    });
  }, [listToRender, renderOption, rowRefs]);

  useUpdate(() => {
    setRowRefs(listToRender.map(() => createRef()));
  }, [listToRender]);

  useUpdate(() => {
    const rowHeight = (rowRefs && rowRefs[0]?.current?.offsetHeight) ?? null;

    setStyle((prevStyle) => ({
      ...prevStyle,
      height: rowHeight !== null ? list.length * rowHeight : 0,
      ...(rowHeight !== null && prevStyle.maxHeight === 0
        ? { maxHeight: rowsToDisplay * rowHeight }
        : {})
    }));
  }, [rowRefs, list]);

  useUpdateOnly(() => {
    if (list.length === 0) {
      setStyle((prevStyle) => ({ ...prevStyle, height: 0 }));
    } else if (list.length >= prevList.length) {
      setListToRender(list);
    } else {
      setListToRender(prevList);
    }
  }, [list, prevList]);

  return (
    <ul
      aria-labelledby={`${id}-label`}
      {...(multi ? { 'aria-multiselectable': true } : {})}
      className={styles.List}
      data-test={`${dataTest}-listbox`}
      id={`${id}-listbox`}
      onTransitionEnd={() => {
        setStyle((prevStyle) => ({
          ...prevStyle
          // Remove native scroll
          // overflowY: list.length > rowsToDisplay ? 'auto' : 'hidden'
        }));

        if (list.length < prevList.length) {
          setListToRender(list);
        }
      }}
      role="listbox"
      style={style}
    >
      <Scroll {...scrollerOptions}>{options}</Scroll>
    </ul>
  );
};

export default memo(List);
