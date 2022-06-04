import { useContext } from 'react';

import { rangeContext } from './context';

export const useRangeContext = () => useContext(rangeContext);
