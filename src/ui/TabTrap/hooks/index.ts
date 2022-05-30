import { useContext } from 'react';

import { tabTrapContext } from '../context';

export const useTabTrap = () => useContext(tabTrapContext);
