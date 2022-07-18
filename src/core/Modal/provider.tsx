import { FC, ReactNode } from 'react';

import { Context } from './context';
import { useModalContextValue } from './hooks';
import ModalArena from './ModalArena';
import { ModalBackdropProps, ModalContainerProps, ModalContext } from './types';

const initialState: ModalContext = {
  actions: {},
  modalsToShow: {},
  orderList: []
};

export const Provider = ({
  baseAnimate,
  BaseBackdrop,
  BaseContainer,
  children
}: {
  baseAnimate?: boolean;
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
