import { FC, ReactNode } from 'react';

import { useModalContextValue } from './hooks';
import { Context } from './context';
import ModalArena from './ModalArena';

import { ModalBackdropProps, ModalContainerProps, ModalContext } from './types';

const initialState: ModalContext = {
  actions: {},
  modalsToShow: {},
  orderList: []
};

export const Provider = ({
  BaseBackdrop,
  children,
  BaseContainer
}: {
  BaseBackdrop?: FC<ModalBackdropProps>;
  children: ReactNode;
  BaseContainer?: FC<ModalContainerProps>;
}): JSX.Element => {
  const { value } = useModalContextValue({ ...initialState, BaseBackdrop, BaseContainer });

  return (
    <Context.Provider value={value}>
      <ModalArena />
      {children}
    </Context.Provider>
  );
};
