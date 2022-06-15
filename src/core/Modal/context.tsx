import { createContext, useContext } from 'react';

import { ModalContext } from './types';

const initialState: ModalContext = {
  actions: {},
  modalsToShow: {},
  orderList: []
};

export const Context = createContext<ModalContext>(initialState);

export const useModal = (): ModalContext => useContext(Context);
