import { createContext } from 'react';

import { TabTrapContext } from '../types';

const initialTabTrapContext: TabTrapContext = {
  firstTabFocusableRef: { current: null },
  lastTabFocusableRef: { current: null }
};

export const tabTrapContext = createContext<TabTrapContext>(initialTabTrapContext);
