import { Children, cloneElement } from 'react';

import { ListAnimatorChild, ListAnimatorKeyMap } from '../types';

export const addClass = (child: ListAnimatorChild | null | undefined, classToAdd?: string) => {
  if (!classToAdd) {
    return child?.props?.className;
  } else if (child?.props?.className) {
    const { className } = child.props;

    const hasIt = !!(className as unknown as string).split(' ').find((c) => c === classToAdd);

    return hasIt ? className : `${className} ${classToAdd}`;
  } else {
    return classToAdd;
  }
};

export const buildKeyMap = (elements: ListAnimatorChild[] | null | undefined) => {
  const keyMap: ListAnimatorKeyMap = {};

  Children.forEach(elements, (child) => {
    if (child?.key) {
      keyMap[`${child.key}`] = true;
    }
  });

  return keyMap;
};

export const cloneWithClassName = (
  child: ListAnimatorChild | null | undefined,
  list: ListAnimatorChild[],
  updatedClassName: string
) => {
  if (!child) {
    return;
  }

  const cloned = cloneElement(
    child,
    {
      ...child.props,
      className: updatedClassName
    },
    child.props.children
  );

  list.push(cloned);
};

export const getUpdates = (
  newChildren: ListAnimatorChild[] | null | undefined,
  oldChildren: ListAnimatorChild[] | null | undefined
) => {
  let enterCount = 0;
  let exitCount = 0;

  const newKeys = buildKeyMap(newChildren);
  const oldKeys = buildKeyMap(oldChildren);

  Children.forEach(newChildren, (child) => {
    const isEntering = !oldKeys[`${child?.key}`];

    if (isEntering) {
      enterCount++;
    }
  });

  Children.forEach(oldChildren, (child) => {
    const isExiting = !newKeys[`${child?.key}`];

    if (isExiting) {
      exitCount++;
    }
  });

  return { enterCount, exitCount, newKeys, oldKeys };
};

export const removeClass = (
  child: ListAnimatorChild | null | undefined,
  classToRemove?: string
) => {
  if (!classToRemove || !child?.props?.className) {
    return child?.props?.className;
  } else {
    return (child.props.className as string)
      .split(' ')
      .filter((c) => c !== classToRemove)
      .join(' ');
  }
};
