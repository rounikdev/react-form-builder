import { ReactNode } from 'react';

import { useModalContextValue } from './hooks';
import { Context } from './context';
import ModalArena from './ModalArena';

import { ModalContext } from './type-definitions';

const initialState: ModalContext = {
  actions: {},
  modalsToShow: {},
  orderList: []
};

export const Provider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { value } = useModalContextValue(initialState);

  return (
    <Context.Provider value={value}>
      <ModalArena />
      {children}
    </Context.Provider>
  );
};
