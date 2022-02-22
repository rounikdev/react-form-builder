import { createContext, useContext } from 'react';

import { ModalContext } from './type-definitions';

const initialState: ModalContext = {
  actions: {},
  modalsToShow: {},
  orderList: []
};

export const Context = createContext<ModalContext>(initialState);

export const useModal = (): ModalContext => useContext(Context);
