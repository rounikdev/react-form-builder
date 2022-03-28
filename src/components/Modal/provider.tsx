import { FC, ReactNode } from 'react';

import { useModalContextValue } from './hooks';
import { Context } from './context';
import ModalArena from './ModalArena';

import { ModalAnimate, ModalBackdropProps, ModalContainerProps, ModalContext } from './types';

const initialState: ModalContext = {
  actions: {},
  modalsToShow: {},
  orderList: []
};

export const Provider = ({
  baseAnimate,
  BaseBackdrop,
  children,
  BaseContainer
}: {
  baseAnimate?: ModalAnimate;
  BaseBackdrop?: FC<ModalBackdropProps>;
  children: ReactNode;
  BaseContainer?: FC<ModalContainerProps>;
}): JSX.Element => {
  const { value } = useModalContextValue({
    ...initialState,
    baseAnimate,
    BaseBackdrop,
    BaseContainer
  });

  return (
    <Context.Provider value={value}>
      <ModalArena />
      {children}
    </Context.Provider>
  );
};
